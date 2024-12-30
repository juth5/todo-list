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

  // let displayImages = [];
	// let inputElement = {};
  // let text = '';
  // let imageFile = {};
  // let isLoading = false;

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
  // onMount(() => {});

  // let insertContent = async (e) => {
  //   e.preventDefault();
  //   if (!text) return ;
  //   isLoading = true;
  //   const docId = recordId;
  //   const todoRef = doc(firebaseDb, "record", docId);

  //   try {
  //     await updateDoc(todoRef, {
  //       todo: arrayUnion({
  //         content: text,
  //         isChecked: false,
  //       }),
  //     });
  //     console.log("データが追加されました");
  //     if (!record.todo) {
  //       record.todo = [];
  //     }
  //     record.todo.push({ content: text, isChecked: false });
  //     record.todo = record.todo;
  //   }
  //   catch (error) {
  //     console.error("エラーが発生しました: ", error);
  //   }
  //   finally {
  //     isLoading = false;
  //   }
  //   text = '';
  //   inputElement.focus();
  // };

  // let saveTodoList = async () => {
  //   isLoading = true;
  //   const docId = recordId;
  //   const docRef = doc(firebaseDb, "record", docId);

  //   try {
  //     await updateDoc(docRef, { todo: record.todo });
  //   } catch (error) {
  //     console.error("データの保存中にエラーが発生しました:", error);
  //   }
  //   finally {
  //     isLoading = false;
  //   }
	// };

  // let formattedDate = (date) => {
  //   return format(new Date(date * 1000), 'yyyy-MM-dd');
  // };

  // let uploadImage = async (e) => {
  //   e.preventDefault();
  //   isLoading = true;

  //   let file = e.currentTarget.files[0];
  //   if (!file) return ;

  //   let storageRef = ref(storage, `images/${file.name}`);

  //   await uploadBytes(storageRef, file);
  //   let downloadURL = await getDownloadURL(storageRef);
  //   const docId = recordId;
  //   const docRef = doc(firebaseDb, "record", docId);

  //   try {
  //     await updateDoc(docRef, {
  //       images: arrayUnion(downloadURL),
  //     });
  //     alert("ファイルをアップロードしました！");
  //     displayImages.push(downloadURL);
  //     displayImages = displayImages;
  //   } catch (error) {
  //     console.error("データの保存中にエラーが発生しました:", error);
  //   }
  //   finally {
  //     isLoading = false;
  //   }
  // };

  // let isValidURL = (str) => {
  //   try {
  //     new URL(str);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  // let getDelayStyle = (index) => {
  //   return index * 0.1;
  // };

  // let deleteRecord = async () => {
  //   let result = confirm('本当にこのレコードを削除しますか？削除すると元には戻せません。');
  //   if (!result) return ;

  //   isLoading = true;

  //   const docRef = doc(firebaseDb, "record", recordId);
  //   await deleteDoc(docRef);
  //   alert('削除しました。');

  //   isLoading = false;
  //   goto('/');
  // };

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

