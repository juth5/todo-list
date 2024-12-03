import { writable } from "svelte/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseDb } from '$lib/scripts/firebase';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc, getDoc } from "firebase/firestore"; 
import { browser } from '$app/environment';

export const currentUser = writable(undefined);
export const authUser = writable(null);

const authPromise = new Promise((resolve, reject) => {
  if (!browser) {
    resolve();
    return ;
  }
  
  onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        currentUser.set(firebaseUser);
      }
      else {
        currentUser.set(null);
      }
      resolve();
    }
    catch (error) {
      console.error("Error fetching user data:");
      reject();
    }
  });
});


export const awaitAuthReady = () => {
  return authPromise;
};