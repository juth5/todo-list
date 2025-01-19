import { currentUser, authUser } from '$lib/scripts/firebase';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, getDoc } from "firebase/firestore"; 
import { firebaseDb } from '$lib/scripts/firebase';

export async function load({ params, fetch, parent, url }) {
  
  await parent();
  let inviterId = url.searchParams.get('inviterId');
  
  if (browser) {
    if (!get(currentUser)) {
      throw redirect(307, '/login');
    }
  }

  return {
    inviterId,
  };
};
