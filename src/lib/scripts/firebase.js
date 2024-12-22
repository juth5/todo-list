// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//ここが設定の場所
const firebaseConfig = {
  apiKey: "AIzaSyBRbN8-PLh8sg4cq0aI_BiHYzAO142CMok",
  authDomain: "todo-list-fd2dd.firebaseapp.com",
  projectId: "todo-list-fd2dd",
  storageBucket: "todo-list-fd2dd.firebasestorage.app",
  messagingSenderId: "2208551502",
  appId: "1:2208551502:web:fc8ad9905ef24bfaa3691f",
  measurementId: "G-G2KNV4CEPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(app);
const auth = getAuth(app);
// Storageのインスタンスを取得
const storage = getStorage(app);

export const currentUser = writable(undefined);
export const authUser = writable(null);

const _authReadyPromise = new Promise((resolve) => {
  if (!browser) {
    resolve();
    return ;
  }

  onAuthStateChanged(auth, (res) => {
    if (res) {
      currentUser.set(res);
    }
    else {
      currentUser.set(null);
    }
    resolve(res);
  });
});

export { app, firebaseDb, auth, storage };