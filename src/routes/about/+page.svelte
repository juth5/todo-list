	<script>
		import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
		import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
		import { firebaseDb } from '$lib/scripts/firebase';
		import { currentUser, authUser } from '$lib/scripts/firebase';
    import { onMount } from "svelte";
		import { goto } from '$app/navigation';

		
		let date = '';
		onMount(() => {
			console.log('aaaaaaaaaaa')
			let today = new Date();
			date = formatDate(today);
		});

		let formatDate = (date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0'); // 0始まりなので+1
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		let saveRecord = async (e) => {
			e.preventDefault();
			alert('push')
			if (!date) return ;
			alert('push2')
			const docRef = await addDoc(collection(firebaseDb, "record"), {
				uid: $currentUser.uid,
				created_at: new Date(date)
			});

			console.log(docRef.id,'ddddddddd');
			alert('push1', docRef.id)

			goto(`/record/${docRef.id}`);
		};
		
	</script>
<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>
<template lang='pug'>
	div.container-960.h100vh.px20
		div.mt100
			h2.text-center.fs20.bold.mb20 レコードを作成しよう
			form(on:submit!='{(e) => saveRecord(e)}')
				div.f.fb.fbw
					div
						div.mb4.bold 日付
						input.input(type='date', bind:value='{date}')
					button.button.w128.rounded-30.bg-light-green.text-white 作成



</template>
<style>

</style>

