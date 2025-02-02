// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9GN4v1-PFXdMMgQa8TTSaZDHhqlDPjew",
  authDomain: "tactical-hydra-424919-a1.firebaseapp.com",
  projectId: "tactical-hydra-424919-a1",
  storageBucket: "tactical-hydra-424919-a1.appspot.com",
  messagingSenderId: "238833383237",
  appId: "1:238833383237:web:465c166aebc2cafb9f302c",
  measurementId: "G-S70TH7GG7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage}



