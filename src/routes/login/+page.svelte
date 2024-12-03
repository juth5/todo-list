<script>
	import { currentUser } from '$lib/scripts/authStore';
  import { collection, addDoc, updateDoc, doc, query, getDocs, where, setDoc } from "firebase/firestore";
  import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";

	let email = '';
  let password = '';

  let submit = (e) => {
    e.preventDefault();
    signUp(email, password);
  };

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<template lang='pug'>
  div.f.fh.mt100
    form.p100.rounded-10.border(on:submit!='{(e) => submit(e)}')
      div.mb24
        div メールアドレス
        input.input(type='email', bind:value='{email}', required)
      div.mb24
        div パスワード
        input.input(type='password', bind:value='{password}', required)
      button.button  新規作成






</template>
<style>

</style>

