<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, arrayUnion } from "firebase/firestore"; 
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { firebaseDb } from '$lib/scripts/firebase';
  import { currentUser, authUser } from '$lib/scripts/firebase';
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { awaitAuthReady } from "../../../lib/scripts/authStore";
  import { format } from 'date-fns';
  
  $: ({ record, recordId } = $page.data);
	let inputElement = {};
  let text = '';

  onMount(() => {});

  let insertContent = async (e) => {
    e.preventDefault();
    if (!text) return ;
    const docId = recordId;
    const todoRef = doc(firebaseDb, "record", docId);

    try {
      await updateDoc(todoRef, {
        todo: arrayUnion({
          content: text,
          isChecked: false,
        }),
      });
      console.log("データが追加されました");
      if (!record.todo) {
        record.todo = [];
      }
      record.todo.push({ content: text, isChecked: false });
      record.todo = record.todo;
    }
    catch (error) {
      console.error("エラーが発生しました: ", error);
    }
    text = '';
    inputElement.focus();
  };

  let saveTodoList = async () => {

    const docId = recordId;
    const docRef = doc(firebaseDb, "record", docId);

    try {
      await updateDoc(docRef, { todo: record.todo });
      alert("データを保存しました！");
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
	};

  let formattedDate = (date) => {
    return format(new Date(date * 1000), 'yyyy-MM-dd');
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
          h2.text-center.fs20.bold.mb20 {formattedDate(record.created_at.seconds)}のレコードです
          form.mb50(on:submit!='{(e) => insertContent(e)}')
            h3.mb12 TODO
            div.f.fm.s-flex-column
              input.input.border.w-full.rounded-30.px20.mr24.s-mr0.s-mb12(bind:value='{text}', bind:this='{inputElement}')
              div.f.s-fr.s-w-full
                button.button.flex-fixed.rounded-20.w128.bg-light-green.text-white 追加
          +if('record.todo && record.todo.length')
            +each('record.todo as todo, index')
              div.f.fm
                div.w10.mr12 {index + 1}.
                input.w20.mr12(type='checkbox', bind:checked='{todo.isChecked}')
                li(class!='{todo.isChecked ? "text-decoration-line-through" : ""}') {todo.content}
            +if('record.todo.length')
              div.f.fr
                div
                  div.mb12 終了したtodoは☑️！完了を押して消そう👍
                  div.f.fr
                    button.button.rounded-20.w128.bg-light-green.text-white(on:click!='{() => saveTodoList()}') 保存

</template>
<style>

</style>

