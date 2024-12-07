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

        const userDoc = doc(firebaseDb, "users", firebaseUser.uid);
        const docSnapshot = await getDoc(userDoc);
        //userデータがあるか確認
        if (docSnapshot.exists()) {
          let user_data = docSnapshot.data();
          authUser.set(user_data);
          console.log('3333333333333333333');
        }
        else {

          let user_data = {
            createdAt: new Date().toISOString(),
            uid: firebaseUser.uid,
          };
          await setDoc(doc(firebaseDb, "users", firebaseUser.uid), user_data);
          authUser.set(user_data);
          //console.log($authUser,'新規登録後のauthUser')
        }
      }
      else {
        currentUser.set(null);
      }
      console.log('認証done')
      resolve();
    }
    catch (error) {
      console.error(error);
      reject();
    }
  });
});


export const awaitAuthReady = () => {
  return authPromise;
};