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
    console.log('subscribe', value)
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
    resolve();
  });
  // onAuthStateChanged(auth, async (value) => {
  //   try {
  //     if (value) {
  //       currentUser.set(value);

  //       const userDoc = doc(firebaseDb, "users", value.uid);
  //       const docSnapshot = await getDoc(userDoc);
  //       //userデータがあるか確認
  //       if (docSnapshot.exists()) {
  //         let user_data = docSnapshot.data();
  //         authUser.set(user_data);
  //         console.log('11111111111111111111111')
  //       }
  //       else {

  //         let user_data = {
  //           createdAt: new Date().toISOString(),
  //           uid: value.uid,
  //         };
  //         await setDoc(doc(firebaseDb, "users", value.uid), user_data);
  //         authUser.set(user_data);
  //       }
  //     }
  //     else {
  //       currentUser.set(null);
  //     }
  //     console.log('2222222222222222')
  //     resolve();
  //   }
  //   catch (error) {
  //     console.error(error);
  //     reject();
  //   }
  // });
});


export const awaitAuthReady = () => {
  return authPromise;
};