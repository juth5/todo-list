import { currentUser, authUser } from '$lib/scripts/firebase';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({params, fetch, parent}) {
  let diaries = [];
  await parent();

  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
    else {
      const userId = get(currentUser).uid;
      let diaryCollection = collection(firebaseDb, "todo");
      let q = query(diaryCollection, where("uid", "==", userId));
      let querySnapshot = await getDocs(q);

      diaries = querySnapshot.docs.map((data) => {
        return {
          id: data.id,
          data: data.data(),
          isChecked: false,
        }
      });
    }
  }

  return {
    diaries
  };
};
