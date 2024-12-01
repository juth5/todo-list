import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc } from "firebase/firestore"; 

import { auth } from "./firebase";
import { getAuth } from "firebase/auth";
import { firebaseDb } from '$lib/scripts/firebase';


export async function signUp(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    let user = userCredential.user;

    await setDoc(doc(firebaseDb, "users", user.uid), {
      email: email,
      createdAt: new Date().toISOString(),
      uid: user.uid,
      //displayName: name,
    });
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
}

export async function getToken() {
  const auth = getAuth();
  const user = auth.currentUser;  

  if (!user) {
    throw new Error("No user is logged in");
  }

  // Firebase ID トークンを取得
  const token = await user.getIdToken();
  return token;
}