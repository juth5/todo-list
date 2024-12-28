import { currentUser, authUser } from '$lib/scripts/firebase';
import { doc } from "firebase/firestore"; 

import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { getDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({ params, fetch, parent }) {

  await parent();
  let userId = params.id;
  let user = {};
  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
    else {
      const userRef = doc(firebaseDb, "users", userId);

      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          user = docSnap.data();
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
  };
};
