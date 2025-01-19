import { currentUser, authUser } from '$lib/scripts/firebase';
import { doc, collection, query, where, getDocs } from "firebase/firestore"; 

import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { getDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({ params, fetch, parent }) {

  await parent();
  let userId = params.id;
  let owners = null;
  let ownerData = [];

  let user = {};
  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
    else {
      const userRef = doc(firebaseDb, "users", userId);

      const pairsRef = collection(firebaseDb, "pairs");
      const q = query(pairsRef, where("guest", "==", userId));
      
      let promises = [ getDocs(q), getDoc(userRef) ];
      
      try {
        let [ pairData, userData ] = await Promise.all(promises);
        //const querySnapshot = await getDocs(q);
        owners = pairData.docs.map((doc) => doc.data().owner);

        // const response = await fetch('/api/user', {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ owners })
        // });
        // if (!response.ok) throw new Error(`Error: ${response.status}`);

        // const data = await response.json();
        // console.log(data,'ddddddd')



        if (owners.length) {
          let users = owners.map((owner) => {
            let owner_ref = doc(firebaseDb, "users", owner);
            return getDoc(owner_ref);
          });
          ownerData = await Promise.all(users);
          ownerData = ownerData.map((docSnap) => (docSnap.exists() ? docSnap.data() : null));
        }
        const docSnap = await getDoc(userRef);

        if (userData.exists()) {
          user = userData.data();
        } else {
          console.log("一致するドキュメントが存在しません");
        }
      } catch (error) {
        console.error("ドキュメントの取得中にエラー:", error);
      }
    }
  }

  return {
    user: user,
    userId,
    ownerData
  };
};
