<script>
	import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
	import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
	import { currentUser, authUser } from '$lib/scripts/authStore';
	import { firebaseDb } from '$lib/scripts/firebase';
  import { page } from "$app/stores";
	import { onMount } from 'svelte';
	import { awaitAuthReady } from "../lib/scripts/authStore"

	import Content from './Content.svelte';
	import Title from '../components/items/Title.svelte';
	import Plan from '../components/items/Plan.svelte';
	import config from '$lib/scripts/config';
  import AuthModal from "../lib/modal/AuthModal.svelte";
	import LoadingModal from "../lib/modal/LoadingModal.svelte";
	

	let isOpenModal = false;
	let todoList = [];
	let text = '';
	let inputElement = {};
	let isLoading = false;

	$: {
		console.log($currentUser,'currentUser');
		console.log($authUser, 'authUser')
	}

	onMount( async () => {
		isLoading = true;
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
					const isReady = await awaitAuthReady();

					if (awaitAuthReady() && $authUser && !$authUser.display_name) {
						isOpenModal = true;
					}
				}
				isLoading = false;
			}
			catch(e) {
				console.error(e);
				isLoading = false;
			}
	});

  let closeModal = () => {
    isOpenModal = false;
  };
	
	let insertContent = async (e) => {
			e.preventDefault();
			if (!text) return ;
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
			inputElement.focus();
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
	+if('isLoading')
		LoadingModal(show='{isLoading}')
	div.container-960.h100vh.px20
		+if('$currentUser')
				div.mt100
				+if('$authUser && $authUser.display_name')
					h3.text-center ようこそ {$authUser.display_name} さん
				h1.text-center.mb40 TODO List
				form.mb50(on:submit!='{(e) => insertContent(e)}')
					h3.mb12 TODO
					div.f.fm.s-flex-column
						input.input.border.w-full.rounded-30.px20.mr24.s-mr0.s-mb12(bind:value='{text}', bind:this='{inputElement}')
						div.f.s-fr.s-w-full
							button.button.flex-fixed.rounded-20.w128.bg-light-green.text-white 追加
				h3.mb12 TODO 一覧
				div.mb30
					+each('todoList as list, index')
						div.f.fm
							div.w10.mr12 {index + 1}.
							input.w20.mr12(type='checkbox', bind:checked='{list.isChecked}')
							li {list.data.content}
				+if('todoList.length')
					div.f.fr
						div
							div.mb12 終了したtodoは☑️！完了を押して消そう👍
							div.f.fr
								button.button.rounded-20.w128.bg-light-green.text-white(on:click!='{() => saveTodoList()}') 完了

		+if('!$currentUser')
			div.f.fh.s-full
				a.w256.rounded-30.bg-light-green.p10.text-center.text-white(href='/login') ログインページへ
		+if('isOpenModal')
			AuthModal(show='{isOpenModal}', onClose='{closeModal}')
</template>
<style>

</style>

