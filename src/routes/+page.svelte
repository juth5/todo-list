<script>
	import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
	import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
	import { currentUser } from '$lib/scripts/authStore';
	import { firebaseDb } from '$lib/scripts/firebase';
  import { page } from "$app/stores";

	import Content from './Content.svelte';
	import Title from '../components/items/Title.svelte';
	import Plan from '../components/items/Plan.svelte';
	import config from '$lib/scripts/config';
	let todoList = [];
	let text = '';

	$: {
		console.log($currentUser,'currentUser')
	}
	
	let insertContent = async (e) => {
			e.preventDefault();

			const docRef = await addDoc(collection(firebaseDb, "diary"), {
				content: text,
				uid: $currentUser.uid,
				created_at: new Date()
			});

			//登録したデータでないとエラーがでる
			let content = {};
			todoList.push({ data: { content: text, id: docRef.id }, isChecked: false });
			todoList = todoList;
			text = '';
		};

		let saveTodoList = async () => {
			let deleteData = todoList.filter(list => list.isChecked);

			let promises = deleteData.map((data) => {
				let ref = doc(firebaseDb, "diary", data.data.id);
				return deleteDoc(ref);
			});
			await Promise.all(promises);
			todoList = todoList.filter(list => !list.isChecked);

		};

		let getData = async () => {
			try {
				if ($currentUser) {
					const userId = $currentUser.uid;
					const diaryCollection = collection(firebaseDb, "diary");
					const q = query(diaryCollection, where("uid", "==", userId));
					const querySnapshot = await getDocs(q);

					querySnapshot.forEach((doc) => {
						todoList.push({ id: doc.id, ...doc.data() }); // ドキュメントIDを含める
				});

				todoList = todoList.map((list) => {
					return {
						data: list,
						isChecked: false,
					}
				});

				console.log(todoList,'hoge')

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
	div.mt100
	+if('$currentUser')
		div.text-center TODO List
		form(on:submit!='{(e) => insertContent(e)}')
				div 今日やること
				input.input(type='text', bind:value='{text}')
				button.button button
		+each('todoList as list')
			div.f.fm
				input.mr12(type='checkbox', bind:checked='{list.isChecked}')
				li {list.data.content}
		button.button(on:click!='{() => saveTodoList()}') deleteData
		button.button(on:click!='{() => getData()}') getData

	+if('!$currentUser')
		a(href='/login') ログインページへ





</template>
<style>

</style>

