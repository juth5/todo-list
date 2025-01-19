<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, arrayUnion, setDoc } from "firebase/firestore"; 
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { firebaseDb } from '$lib/scripts/firebase';
  import { currentUser, authUser, storage } from '$lib/scripts/firebase';
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { awaitAuthReady } from "$lib/scripts/authStore";
  import { format } from 'date-fns';
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import LoadingModal from "$lib/modal/LoadingModal.svelte";
  import { goto } from '$app/navigation';
  import EditProfileModal from "$lib/modal/EditProfileModal.svelte";


  $: ({ inviterId } = $page.data);
  $: {
    console.log(inviterId,'aaaaaa')
  }


  let acceptInvite = async () => {
    let docId = `${inviterId}_${$currentUser.uid}`;
    try {
      await setDoc(doc(firebaseDb, "pairs", docId), {
        owner: inviterId,
        guest: $currentUser.uid,
        created_at: new Date(),
      });
    } catch (error) {
      console.error("Error:", error);
    }

  };

</script>
<svelte:head>
<title>Invite</title>
<meta name="description" content="About this app" />
</svelte:head>
<template lang='pug'>
div.container-960.h100vh.px20
  +await('awaitAuthReady()')
    //- LoadingModal(show='{true}')
    +then('res')
      +if('$currentUser')
        div.mt100
        h3.text-center.mb28 招待
        div.mb14 以下のボタンを押すと、招待主と内容を共有することができます。
        div.f.fr
          button.button.bg-light-green.text-white.rounded-30(on:click!='{() => acceptInvite()}') 招待を受け取る
      //- +if('isLoading')
      //-   LoadingModal(show='{true}')
</template>
<style>

</style>

