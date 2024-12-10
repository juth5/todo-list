import { writable } from "svelte/store";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { currentUser, authUser } from '$lib/scripts/firebase';

import { firebaseDb } from '$lib/scripts/firebase';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc, getDoc } from "firebase/firestore"; 
import { browser } from '$app/environment';


const authPromise = new Promise((resolve, reject) => {
  if (!browser) {
    resolve();
    return ;
  }
  currentUser.subscribe(async (value) => {
    // 初期化時は無視
    if (value === undefined) return ;
    
    if (value) {
      try {
        //ドキュメントを参照
        const userDoc = doc(firebaseDb, "users", value.uid);
        //実在するか確認
        const docSnapshot = await getDoc(userDoc);
        //あったら
        if (docSnapshot.exists()) {
          //取得
          let user_data = docSnapshot.data();
          //userデータをauthUserにセット
          authUser.set(user_data);
        }
        //実在しない場合
        else {
          //データをセット
          let user_data = {
            createdAt: new Date().toISOString(),
            uid: value.uid,
          };
          //書き込む
          await setDoc(doc(firebaseDb, "users", value.uid), user_data);
          //authUserにセットする
          authUser.set(user_data);
        }
      }
      catch (e) {
        alert(e.message);
      }
    }
    else {
      authUser.set(null);
    }
    resolve('done');
  });
});


export const awaitAuthReady = () => {
  return authPromise;
};