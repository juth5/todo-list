import { currentUser, authUser } from '$lib/scripts/firebase';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, orderBy } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({params, fetch, parent}) {
  let records = [];
  await parent();

  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
    else {
      const userId = get(currentUser).uid;
      let recordCollection = collection(firebaseDb, "record");
      let q = query(
        recordCollection, 
        where("uid", "==", userId),
        orderBy("created_at", "desc")
      );
      let querySnapshot = await getDocs(q);

      records = querySnapshot.docs.map((data) => {
        return {
          id: data.id,
          data: data.data(),
        }
      });
    }
  }

  return {
    records
  };
};
