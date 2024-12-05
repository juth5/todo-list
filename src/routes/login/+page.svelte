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
  div.f.fh.mt100
    div.mr20
      form.pl100.pr100.pb100.pt50.rounded-10.border(on:submit!='{(e) => submit(e)}')
        div.text-center.mb50 初めての方
        div.mb24
          div メールアドレス
          input.input(type='email', bind:value='{email}', required)
        div.mb24
          div パスワード
          input.input(type='password', bind:value='{password}', required)
        button.button.bg-light-green  新規作成
    div
      form.pl100.pr100.pb100.pt50.rounded-10.border(on:submit!='{(e) => login(e)}')
        div.text-center.mb50 既にアカウントをお持ちの方
        div.mb24
          div メールアドレス
          input.input(type='email', bind:value='{loginEmail}', required)
        div.mb24
          div パスワード
          input.input(type='password', bind:value='{loginPassword}', required)
        button.button.bg-greenyellow  ログイン






</template>
<style>

</style>

