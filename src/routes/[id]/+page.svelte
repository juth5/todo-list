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

  $: ({ user, userId } = $page.data);
  let isOpenEditProfileModal = false;
  let src = '/no-image.png';

  $: {
  }

  let openEditProfileModal = () => {
    isOpenEditProfileModal = true;
  };

  let closeEditProfileModal = () => {
    isOpenEditProfileModal = false;
  };

  let openShareModal = () => {
    alert("share");
  };
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
        h2.text-center.fs20.bold.mb20 Myページ
        div.f.ft.mb16
          div.s89.rounded-full.overflow-hidden.mr16
            img.block.object-fit-cover.s-full(src='{$authUser.icon_image || src}')
          div.fs20 {$authUser.display_name}
        div.f.fr.mb18
          button.button.flex-fixed.rounded-20.w150.bg-light-green.text-white(on:click!='{() => openEditProfileModal()}') プロフィール編集
        div.f.fr
          button.button.flex-fixed.rounded-20.w150.bg-light-green.text-white(on:click!='{() => openShareModal()}') 共有
        EditProfileModal(bind:show='{isOpenEditProfileModal}')
      //- +if('isLoading')
      //-   LoadingModal(show='{true}')
</template>
<style>

</style>

