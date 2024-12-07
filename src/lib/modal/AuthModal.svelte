<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"; 
  import { currentUser, authUser } from '$lib/scripts/authStore';
  import { firebaseDb } from '$lib/scripts/firebase';

  export let show = false;
  export let onClose = () => {};
  let nameValue = '';
  $: {
    show;
  }

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


  
</script>
<template lang='pug'>
  +if('show')
    div.modal-backdrop.f.fh(on:click!='{onClose}')
      div.modal-content.relative(on:click|stopPropagation)
        div.absolute.t0.r5
          button.p6.fs20(on:click!='{onClose}') ×
        h3.text-center.mb24 ユーザー名を登録しよう
        div.mb32
          div.mb8 ユーザー名
          input.input.w-full.rounded-30.px20(type='text', bind:value='{nameValue}')
        div.f.fc
          button.button.rounded-20.w128.bg-light-green.text-white(on:click='{registerUserName}') 登録


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
