<script>
	import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
	import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
	import { currentUser } from '$lib/scripts/authStore';
	import { firebaseDb } from '$lib/scripts/firebase';
  import { page } from "$app/stores";
	import { onMount } from 'svelte';


	import Content from './Content.svelte';
	import Title from '../components/items/Title.svelte';
	import Plan from '../components/items/Plan.svelte';
	import config from '$lib/scripts/config';
	let todoList = [];
	let text = '';

	$: {
		console.log($currentUser,'currentUser')
	}

	onMount( async () => {
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
	});

	
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
	div.container-1240
		+if('$currentUser')
			h1.text-center.mb40 TODO List
			form.mb50(on:submit!='{(e) => insertContent(e)}')
					h2.mb12 今日やること(TODO)
					div.f.fm
						input.input.border.w-full.mr24(bind:value='{text}')
						button.button.flex-fixed.w128 登録
			div.mb30
				+each('todoList as list, index')
					div.f.fm
						div.w10.mr12 {index + 1}.
						input.w20.mr12(type='checkbox', bind:checked='{list.isChecked}')
						li {list.data.content}
			+if('todoList.length')
				div
					button.button(on:click!='{() => saveTodoList()}') 登録

		+if('!$currentUser')
			a(href='/login') ログインページへ





</template>
<style>

</style>

