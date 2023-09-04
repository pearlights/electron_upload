// Import the functions you need from the SDKs you need
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

import serviceAccount from './serviceAccountKey.json';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'mimicmate-ingress'
});

const bucket = getStorage().bucket();

export default bucket;


