<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"; 
  import { currentUser, authUser, storage } from '$lib/scripts/firebase';
  import { firebaseDb } from '$lib/scripts/firebase';
  import { createEventDispatcher } from "svelte";
	import { onMount } from 'svelte';
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

  export let show = false;
  export let onClose = () => {};
  let src = '/no-image.png';
  let file = null;
  let userName = $authUser.display_name;

  let fileInput = {};
  const dispatch = createEventDispatcher();
  $: {
    show;
    if (!$authUser.icon_image) {
      src = '/no-image.png';
    }
  }

  let closeModal = () => {
    src = $authUser.icon_image;
    userName = $authUser.display_name;
    show = false;
  };

let registerUserName = async () => {
  if (!nameValue) return ;
  try {
    // currentUser と nameValue を検証
    if (!$currentUser || !$currentUser.uid) {
      console.error("currentUserが未定義、またはUIDがありません");
      return;
    }
    if (!nameValue || nameValue.trim() === "") {
      console.error("名前が入力されていません");
      return;
    }
    let user_data = {
      uid: $currentUser.uid,
      display_name: nameValue,
    };

    // Firestoreにデータを保存
    await setDoc(doc(firebaseDb, "users", $currentUser.uid), {
      display_name: nameValue,
      createdAt: serverTimestamp(),
    });

    authUser.set(user_data);
    console.log("ユーザー名が登録されました");
    nameValue = ""; // 入力フィールドをリセット
    onClose();
  } catch (error) {
    console.error("Firestoreエラー:", error.message);
  }
};

let clickInputFile = () => {
  fileInput.click();
};

let uploadUserImage = async (e) => {
  e.preventDefault();

  file = e.currentTarget.files[0];
  if (!file) return ;
  src = URL.createObjectURL(file);
};

let saveUserProfile = async () => {
  let updateUserData = {};
  //ファイルに変更があれば
  if (file) {
    let storageRef = ref(storage, `images/${file.name}`);  
    await uploadBytes(storageRef, file);
    let downloadURL = await getDownloadURL(storageRef);
    updateUserData.icon_image = downloadURL;
  }
  updateUserData.display_name = userName;

  let userRef = doc(firebaseDb, "users", $currentUser.uid);

  try {
    await updateDoc(doc(firebaseDb, "users", $currentUser.uid), updateUserData);
      alert("プロフィールを更新しました！");
      if (!file) {
        updateUserData.icon_image = $authUser.icon_image;
      }
      authUser.set(updateUserData);

    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
    finally {
      //isLoading = false;
    }
};

  
</script>
<template lang='pug'>
  +if('show')
    div.modal-backdrop.f.fh(on:click!='{() => closeModal()}')
      div.modal-content.relative(on:click|stopPropagation)
        div.absolute.t0.r5
          button.p6.fs20(on:click!='{() => closeModal()}') ×
        div.f.fc.mb18
          div.relative.s89.rounded-full.cursor-pointer.overflow-hidden.border(on:click!='{() => clickInputFile()}')
            img.block.s-full.object-fit-cover.rounded-full(src='{$authUser.icon_image || src}')
            div.absolute.trbl0.f.fh ➕
            input.hide(type='file', bind:this='{fileInput}', on:change!='{(e) => uploadUserImage(e)}')
        div.mb32
          div.mb8 ユーザー名
          input.input.w-full.px20.rounded-30(type='text', bind:value='{userName}')
        div.f.fr
          button.button.flex-fixed.rounded-20.w128.bg-light-green.text-white(on:click!='{() => saveUserProfile()}') 保存

        






</template>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    background-color: #fff;
    margin: 10% auto;
    padding: 30px;
    width: 80%;
    max-width: 500px;
    border-radius: 8px;
  }
</style>
