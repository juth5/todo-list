import { currentUser } from '$lib/scripts/authStore';
import { firebaseDb } from '$lib/scripts/firebase';
import { get } from 'svelte/store';
import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
import { browser } from '$app/environment';


export async function load({params, fetch}) {

  return {
    //querySnapshot,
  };
};
