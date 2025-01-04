<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, arrayUnion } from "firebase/firestore"; 
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

  

  $: {
  }

  

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
        h3.text-center 招待
      //- +if('isLoading')
      //-   LoadingModal(show='{true}')
</template>
<style>

</style>

