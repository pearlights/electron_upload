import { app, ipcMain, dialog } from 'electron';
import serve from 'electron-serve';
import path from "path";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { askForFullDiskAccess } from 'node-mac-permissions';

import bucket from './firebase/config';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 540,   //540
    height: 160,  //160
  });

  mainWindow.setMenuBarVisibility(false);
  

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }

})();

app.on('window-all-closed', () => {
  app.quit();
});


ipcMain.on('uploadFile', async (event) => {

  const homePath = app.getPath('home');

  const filePath = path.join(homePath, 'Library', 'Messages', 'chat.db');

  fs.access(filePath, fs.constants.R_OK, (err) => {
     
    // dialog.showMessageBox({
    //   type: 'info',
    //   title: "Error",
    //   message: JSON.stringify(err),
    //   button: ['OK']
    // })
    
    if (!err) {
      uploadFunc();
    } else {
      askForFullDiskAccess();
    }
  }) 

  const uploadFunc = () => {

    const fileStream = fs.createReadStream(filePath);

    const fileId = uuidv4();

    const { size } = fs.statSync(filePath);

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: fileId 
      }
    };                           

    const fileRef = bucket.file(`chat-${fileId}.db`);

    const uploadTask = fileRef.createWriteStream({
      metadata,
      resumable: true
    });

    fileStream.pipe(uploadTask);

    uploadTask.on('finish', () => {
      // File uploaded successfully
      event.reply('status', 'finish');
      setTimeout(() => {
        app.quit();
      }, 1500);
    });

    uploadTask.on('error', err => {
      // Handle error
      console.log(err);
      event.reply('status', 'err');
    });

    uploadTask.on('progress', snapshot => {
      let progress = Math.round((snapshot.bytesWritten / size) * 100);
      event.reply('status', 'progress');
      // Send progress to renderer
      event.reply('uploadProgress', progress); 
    });

  }

});
