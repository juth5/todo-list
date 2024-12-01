import { writable } from "svelte/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseDb } from '$lib/scripts/firebase';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc, getDoc } from "firebase/firestore"; 

export const currentUser = writable(undefined);
export const authUser = writable(null);

onAuthStateChanged(auth, async (firebaseUser) => {
  try {
    if (firebaseUser) {
      currentUser.set(firebaseUser);
    }
    else {
      currentUser.set(null);
    }
  }
  catch (error) {
    console.error("Error fetching user data:");
  }
});

