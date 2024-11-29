import { writable } from "svelte/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseDb } from '$lib/scripts/firebase';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc, getDoc } from "firebase/firestore"; 

export const currentUser = writable(null);

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDocRef = doc(firebaseDb, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    currentUser.set({
      uid: firebaseUser.uid,
      ...userDoc.data(),
    });
  }
  else {
    currentUser.set(null);
  }
});