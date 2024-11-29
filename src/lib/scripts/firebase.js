// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYNhMD4jjD7O580eoHfKFsQDjlmxyy-qY",
  authDomain: "zero-zero-62aac.firebaseapp.com",
  projectId: "zero-zero-62aac",
  storageBucket: "zero-zero-62aac.firebasestorage.app",
  messagingSenderId: "425841122157",
  appId: "1:425841122157:web:d554b332dec46591e39864",
  measurementId: "G-ZDNDHGBKKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(app);
const auth = getAuth(app);

export { app, firebaseDb, auth };