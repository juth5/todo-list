<script>
	import { currentUser } from '$lib/scripts/authStore';
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc } from "firebase/firestore";
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { goto } from '$app/navigation';


	let email = '';
  let password = '';

  let loginEmail = '';
  let loginPassword = '';

  let submit = (e) => {
    e.preventDefault();
    signUp(email, password);
  };

  let login = async (e) => {
    e.preventDefault();
    await logIn(loginEmail, loginPassword);
    goto('/');
  };

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<template lang='pug'>
  div.container-1240.f.fh.mt100.s-flex-column.s-px20
    div.w400.mr20.s-w-full.s-mr0.s-mb20
      form.p20.pb100.pt50.rounded-10.border(on:submit!='{(e) => submit(e)}')
        div.text-center.bold.fs20.mb50 初めての方
        div.mb24
          div.mb6 メールアドレス
          input.input.w256(type='email', bind:value='{email}', required)
        div.mb40
          div.mb6 パスワード
          input.input.w256(type='password', bind:value='{password}', required)
        div.f.fc
          button.button.bg-light-green.text-white.rounded-30.w256.h40  新規作成
    div.w400.s-w-full
      form.p20.pb100.pt50.rounded-10.border(on:submit!='{(e) => login(e)}')
        div.text-center.bold.fs20.mb50 既にアカウントをお持ちの方
        div.mb24
          div.mb6 メールアドレス
          input.input.w256(type='email', bind:value='{loginEmail}', required)
        div.mb40
          div.mb6 パスワード
          input.input.w256(type='password', bind:value='{loginPassword}', required)
        div.f.fc
          button.button.bg-light-green.text-white.rounded-30.w256.h40  ログイン






</template>
<style>

</style>

