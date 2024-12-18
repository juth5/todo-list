import { currentUser, authUser } from '$lib/scripts/firebase';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, getDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({params, fetch, parent}) {
  let diaries = [];
  let record = {};

  await parent();
  let recordId = params.id;
  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
    else {
      const recordRef = doc(firebaseDb, "record", recordId);

      try {
        const docSnap = await getDoc(recordRef);
        if (docSnap.exists()) {
          record = docSnap.data();
          console.log("ドキュメントのデータ:", docSnap.data());
        } else {
          console.log("一致するドキュメントが存在しません");
        }
      } catch (error) {
        console.error("ドキュメントの取得中にエラー:", error);
      }
    }
  }

  return {
    diaries,
    record: record,
    recordId,
  };
};
