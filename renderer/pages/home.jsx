import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';


// Home component
export default function Home() {

  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState('progress');

  const startUpload = () => {
    ipcRenderer.send('uploadFile');
  }

  useEffect(() => {
    ipcRenderer.on('uploadProgress', (event, prog) => {
      setProgress(prog);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on('status', (event, state) => {
      setStatus(state);
    });
  }, []);

  return (
    <div className='bg-gray-900 h-full w-[520px]'>
      <button className="text-base px-4 py-2 bg-blue-800 text-white" onClick={startUpload}>Upload</button>
      <div className='text-white text-bold w-[520px] text-base flex justify-start m-2 ml-4'>
          <span>{
            status === 'progress' ? `${progress}%`
              : status === 'finish' ? 'Upload complete.'
                : status === 'pause' ? `${progress}% Upload paused.`
                  : status === 'resume' ? `${progress}% Upload resumed.`
                    : status === 'err' ? 'Failed.'
                      : '0%'
          }</span>
      </div>
      <div className='w-[520px] bg-green-200 h-4 rounded-md relative mx-[10px]'>
        <div className='bg-green-600 h-4 absolute rounded-md left-0' style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}