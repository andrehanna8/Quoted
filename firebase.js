import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDgnr8GLMtXGCYEe-d2Jre8UJsCgvXXtp4",
  authDomain: "quoted-e0fdc.firebaseapp.com",
  projectId: "quoted-e0fdc",
  storageBucket: "quoted-e0fdc.appspot.com",
  messagingSenderId: "857155580577",
  appId: "1:857155580577:web:c7e28c955dcbab9cc7b6e0",
  measurementId: "G-C1P059FVYE"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { db, storage, auth, serverTimestamp };
