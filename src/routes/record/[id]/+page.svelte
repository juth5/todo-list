<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc, arrayUnion } from "firebase/firestore"; 
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { firebaseDb } from '$lib/scripts/firebase';
  import { currentUser, authUser, storage } from '$lib/scripts/firebase';
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { awaitAuthReady } from "../../../lib/scripts/authStore";
  import { format } from 'date-fns';
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import LoadingModal from "$lib/modal/LoadingModal.svelte";
  import { goto } from '$app/navigation';

  $: ({ record, recordId } = $page.data);
  let displayImages = [];
	let inputElement = {};
  let text = '';
  let imageFile = {};
  let isLoading = false;

  $: {
    if (record.images) {
      displayImages = record.images;
    }
  }

  onMount(() => {});

  let insertContent = async (e) => {
    e.preventDefault();
    if (!text) return ;
    isLoading = true;
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
    finally {
      isLoading = false;
    }
    text = '';
    inputElement.focus();
  };

  let saveTodoList = async () => {
    isLoading = true;
    const docId = recordId;
    const docRef = doc(firebaseDb, "record", docId);

    try {
      await updateDoc(docRef, { todo: record.todo });
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
    finally {
      isLoading = false;
    }
	};

  let formattedDate = (date) => {
    return format(new Date(date * 1000), 'yyyy-MM-dd');
  };

  let uploadImage = async (e) => {
    e.preventDefault();
    isLoading = true;

    let file = e.currentTarget.files[0];
    if (!file) return ;

    let storageRef = ref(storage, `images/${file.name}`);

    await uploadBytes(storageRef, file);
    let downloadURL = await getDownloadURL(storageRef);
    const docId = recordId;
    const docRef = doc(firebaseDb, "record", docId);

    try {
      await updateDoc(docRef, {
        images: arrayUnion(downloadURL),
      });
      alert("ファイルをアップロードしました！");
      displayImages.push(downloadURL);
      displayImages = displayImages;
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
    finally {
      isLoading = false;
    }
  };

  let isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  let getDelayStyle = (index) => {
    return index * 0.1;
  };

  let deleteRecord = async () => {
    let result = confirm('本当にこのレコードを削除しますか？削除すると元には戻せません。');
    if (!result) return ;

    isLoading = true;

    const docRef = doc(firebaseDb, "record", recordId);
    await deleteDoc(docRef);
    alert('削除しました。');

    isLoading = false;
    goto('/');
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
          button.button.relative.f.fh.rounded-30.s40.bg-white.p4.z100(on:click!='{() => deleteRecord()}')
              img.block.s-full.object-fit-contain(src='/delete.svg')
          form.mb50(on:submit!='{(e) => insertContent(e)}')
            h3.mb12 TODO
            div.f.fm.s-flex-column
              input.input.border.w-full.rounded-30.px20.mr24.s-mr0.s-mb12(bind:value='{text}', bind:this='{inputElement}')
              div.f.s-fr.s-w-full
                button.button.flex-fixed.rounded-20.w128.bg-light-green.text-white 追加
          div.mb50
            +if('record.todo && record.todo.length')
              h3.mb12 TODO一覧
              div.mb12
                +each('record.todo as todo, index')
                  div.f.ft.mb6.animate-slide(style!=`animation-delay: {getDelayStyle(index)}s`)
                    div.f.fm.flex-fixed
                      div.w10.mr12 {index + 1}.
                      input.w20.mr12(type='checkbox', bind:checked='{todo.isChecked}')
                    +if('!isValidURL(todo.content)')
                      li.word-break-all(class!='{todo.isChecked ? "text-decoration-line-through" : ""}') {todo.content}
                      +else
                        a.word-break-all.text-link(href!='{todo.content}', class!='{todo.isChecked ? "text-decoration-line-through" : ""}', target='_blank') {todo.content}
              +if('record.todo.length')
                div.f.fr
                  div
                    div.mb12 終了したtodoは✅！保存を押して消そう👍
                    div.f.fr
                      button.button.rounded-20.w128.bg-light-green.text-white(on:click!='{() => saveTodoList()}') 保存
          div.pb100
            h3.mb12 画像を追加
            input.mb12(type='file', on:change!='{(e) => uploadImage(e)}')
            +if('displayImages && displayImages.length')
              div.f.fm.s-flex-column
                +each('displayImages as image')
                  div.col4.s-w-full.p10
                    img.s-full.block.object-fit-contain(src='{image}')
        div.fixed.b0.r0.w-full.bg-black.py6.px20
          div.container-1240.f.fr.w-full
            button.button.relative.f.fh.rounded-30.s40.bg-white.p4.z100(on:click!='{() => deleteRecord()}')
              img.block.s-full.object-fit-contain(src='/delete.svg')
      +if('isLoading')
        LoadingModal(show='{true}')
</template>
<style>

</style>

