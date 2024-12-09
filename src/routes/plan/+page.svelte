<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where } from "firebase/firestore"; 
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
  import Title from '../../components/items/Title.svelte';
  import SubTitle from '../../components/items/SubTitle.svelte';
  import { firebaseDb } from '$lib/scripts/firebase';
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { currentUser, authUser } from '$lib/scripts/firebase';

$: {
  if ($currentUser) {
    console.warn($currentUser.uid,"currentUser");
  }
}
// Firestoreを利用した操作
  let inputElement = {};

  let fileChange = (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    // 読み込み完了後にバイナリデータを表示
    reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        // バイナリデータを16進数で表示する
        console.log(Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
  };

let inesrtDB = async (e) => {
  try {
    const docRef = await addDoc(collection(firebaseDb, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
      ownerId: $currentUser.uid,
    });
    console.log("Document written with ID: ", docRef.id);
    let hoge = await getToken();
    console.log(hoge,'hogehogehogehoge')
  } catch (e) {
    console.error("Error adding document: ", e);
  };
};

let update = async () => {
  try {
    const docRef = await updateDoc(doc(firebaseDb, "users", id), {
      first: "hage",
      last: "fuga",
      born: 2020,
    });
    let hoge = await getToken();
    console.log(hoge,'hogehogehogehoge')
  } catch (e) {
    console.error("Error adding document: ", e);
  };

};
let submit = (e) => {
  e.preventDefault();
  let value = inputElement.value;
  let email = 'koko@co.jp';
  let password = 'koko55';
  signUp(email, password);
};

let userSignOut = () => {

  logOut();
};

let createDiary = async (e) => {
  e.preventDefault();

  const docRef = await addDoc(collection(firebaseDb, "diary"), {
      content: "今日はなんやかんや今日でした。",
      uid: $currentUser.uid,
      created_at: new Date()
    });

    const myDiary = [];



};

let signIn = () => {
  let email = 'ccc@co.jp';
  let password = 'hogehoge55';
  logIn(email, password);
};

let getDiary = async () => {
  try {
    if ($currentUser) {
      const userId = $currentUser.uid;
      const diaryCollection = collection(firebaseDb, "diary");
      const q = query(diaryCollection, where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);
      const myDiary = [];

      querySnapshot.forEach((doc) => {
      myDiary.push({ id: doc.id, ...doc.data() }); // ドキュメントIDを含める
    });

    console.log(myDiary,"myDiary");
    }
  }
  catch(e) {
    console.error(e);
  }

};
	
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<template lang='pug'>

  div.w-full.mt100.s-px16
    div.container-1024
      div.mb40.s-mb20
        div.text-center.mb60.s-mb30
          Title(title='スタンダードプランの詳細')
        div.mb40
          div.text-left.mb20.s-mb10
            SubTitle(title='週2回の対面学習')
          div.mb12
            p.lh18 毎週、土、日曜日の朝9時から12時までの3時間。
            p Gitの使い方に慣れてきたら、リモートによる学習も可能です。
          img.block.object-fit-cover.rounded-10(src='/frame7.png')
		
      
          input.input(type='file', on:change!='{(e) => fileChange(e)}')
          button.button(type='button', on:click!='{(e) => inesrtDB(e)}') insert

          form(type='submit', on:submit!='{(e) => submit(e)}')
            input.input(type='text', bind:this='{inputElement}')
            button.button 送信
          button.button(type='button', on:click!='{(e) => userSignOut(e)}') signOut
          button.button(type='button', on:click!='{(e) => signIn(e)}') signIn
          button.button(type='button', on:click!='{(e) => update(e)}') update

          button.button(type='button', on:click!='{(e) => createDiary(e)}') createDiary
          button.button(type='button', on:click!='{(e) => getDiary(e)}') getDiary





</template>
<style>

</style>

