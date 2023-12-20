// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp-pNPpPRMePcYIaWYhjokpipOZuf78eA",
  authDomain: "project-kalasan-e4cf8.firebaseapp.com",
  projectId: "project-kalasan-e4cf8",
  storageBucket: "project-kalasan-e4cf8.appspot.com",
  messagingSenderId: "954057882977",
  appId: "1:954057882977:web:9a22481d1725e710615920",
  measurementId: "G-64MMWS63CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);