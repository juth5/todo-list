<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { firebaseDb } from '$lib/scripts/firebase';
  import { currentUser, authUser } from '$lib/scripts/firebase';
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { awaitAuthReady } from "../../../lib/scripts/authStore";
  
  $: ({ diaries, record } = $page.data);

  onMount(() => {

  });


</script>
<svelte:head>
<title>About</title>
<meta name="description" content="About this app" />
</svelte:head>
<template lang='pug'>
div.container-960.h100vh.px20
  +await('awaitAuthReady()')
    //- LoadingModal(show='{true}')
    +then('res')
      +if('$currentUser')
        div.mt100
          h2.text-center.fs20.bold.mb20 あなたのレコードです
          +each('record.todo as todo')
            div {todo}

    



</template>
<style>

</style>

