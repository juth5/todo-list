<script>
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc } from "firebase/firestore";
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { goto } from '$app/navigation';
  import { awaitAuthReady } from "$lib/scripts/authStore";
  import LoadingModal from "$lib/modal/LoadingModal.svelte";

	let email = '';
  let password = '';
  let currentMode = 'logIn';
  let isLoading = false;

  let loginEmail = '';
  let loginPassword = '';

  let signIn = async (e) => {
    e.preventDefault();
    isLoading = true;
    try {
      await signUp(email, password);
      goto('/');
    }
    catch(e) {
      console.error(e);
      alert(e);
    }
    finally {
      isLoading = false;
    }
  };

  let login = async (e) => {
    e.preventDefault();
    isLoading = true;
    try {
      await logIn(loginEmail, loginPassword);
      goto('/');
    }
    catch(e) {
      isLoading = false;
    }
    finally {
      isLoading = false;
    }
  };

  let changeMode = (mode) => {
    currentMode = mode;
  };

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<template lang='pug'>
  div.container-960.mt100
    div.f.fh.mb60.border-bottom.bw2.s-mb30
      button.f.fm.h40.rounded-top-right-15.rounded-top-left-15.text-center.py4.px40.border-top.border-right.border-left.mr20(type='button', on:click!='{() => changeMode("signUp")}', class!="{currentMode === 'signUp' ? 'bg-light-green text-white': ''}") 新規登録
      button.f.fm.h40.rounded-top-right-15.rounded-top-left-15.text-center.py4.px40.border-top.border-right.border-left(type='button', on:click!='{() => changeMode("logIn")}', class!="{currentMode === 'logIn' ? 'bg-light-green text-white': ''}") ログイン
    div.f.fh.s-flex-column.s-px20
      +if('currentMode === "signUp"')
        div.w400.s-w-full.s-mr0.s-mb20
          form.p20.py50.rounded-10.border(on:submit!='{(e) => signIn(e)}')
            div.text-center.bold.fs20.mb50 初めての方
            div.mb24
              div.mb6 メールアドレス
              input.input.w-full.px20.rounded-30(type='email', bind:value='{email}', required)
            div.mb40
              div.mb6 パスワード
              input.input.w-full.px20.rounded-30(type='password', bind:value='{password}', required)
            div.f.fc
              button.button.bg-light-green.text-white.rounded-30.w256.h40  新規登録
      +if('currentMode === "logIn"')
        div.w400.s-w-full
          form.p20.py50.rounded-10.border(on:submit!='{(e) => login(e)}')
            div.text-center.bold.fs20.mb50 既にアカウントをお持ちの方
            div.mb24
              div.mb6 メールアドレス
              input.input.w-full.px20.rounded-30(type='email', bind:value='{loginEmail}', required)
            div.mb40
              div.mb6 パスワード
              input.input.w-full.px20.rounded-30(type='password', bind:value='{loginPassword}', required)
            div.f.fc
              button.button.bg-light-green.text-white.rounded-30.w256.h40  ログイン
    +if('isLoading')
      LoadingModal(show='{true}')
</template>
<style>

</style>

