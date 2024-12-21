<script>
	import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
	import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
  import { currentUser, authUser } from '$lib/scripts/firebase';
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
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';


	let isOpenModal = false;
	let todoList = [];
	let text = '';
	let inputElement = {};
	let isLoading = false;
	let isLogin = null;
	let recordDate = null;
	$: ({ records } = $page.data);

	$: {
		if ($authUser && !$authUser.display_name) {
			isOpenModal = true;
		}
	}

  let closeModal = () => {
    isOpenModal = false;
  };
	
	let insertContent = async (e) => {
			e.preventDefault();
			if (!text) return ;
			const docRef = await addDoc(collection(firebaseDb, "todo"), {
				content: text,
				uid: $currentUser.uid,
				created_at: new Date()
			});

			//登録したデータでないとエラーがでる
			let content = {};

			diaries.push({ data: { content: text }, id: docRef.id, isChecked: false });
			diaries = diaries;

			text = '';
			inputElement.focus();
		};

		let saveTodoList = async () => {
			let deleteData = [];

			for (let i = diaries.length - 1; i >= 0; i--) { // 後ろからループ
				if (diaries[i].isChecked) {
					deleteData.push(diaries.splice(i, 1)[0]); // 該当要素を削除し、取り出す
				}
			}

			let promises = deleteData.map((data) => {
				let ref = doc(firebaseDb, "todo", data.id);
				return deleteDoc(ref);
			});

			await Promise.all(promises);

			diaries = diaries;
		};
		let formattedDate = (date) => {
			return format(new Date(date * 1000), 'yyyy-MM-dd');
		};

		let saveRecord = async (e) => {
			e.preventDefault();
			if (!recordDate) return ;

			const docRef = await addDoc(collection(firebaseDb, "record"), {
				uid: $currentUser.uid,
				created_at: new Date(recordDate)
			});
			goto(`/record/${docRef.id}`);
		};

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<template lang='pug'>
	div.container-960.h100vh.px20
		+await('awaitAuthReady()')
			LoadingModal(show='{true}')
			+then('res')
				+if('$currentUser')
					div.mt100
						+if('$authUser && $authUser.display_name')
							h3.text-center ようこそ {$authUser.display_name} さん
						h1.text-center.mb40.s-mb20 TODO List
						h2.text-center.fs20.bold.mb20.s-mb10 レコードを作成しよう
						div.mb40.s-mb20
							form(on:submit!='{(e) => saveRecord(e)}')
								div.f.fb.fbw
									div
										div.mb4.bold 日付
										input.input(type='date', bind:value='{recordDate}')
									button.button.w128.rounded-30.bg-light-green.text-white 作成

						h3.mb12 レコード一覧
						div.mb30
							+if('records && records.length')
								+each('records as record, index')
									a.block.lh20(href='/record/{record.id}') {index + 1}. {formattedDate(record.data.created_at.seconds)}のレコード
					+if('isOpenModal')
						AuthModal(show='{isOpenModal}', onClose='{closeModal}')
					+else
						div.f.fh.s-full
							a.w256.rounded-30.bg-light-green.p10.text-center.text-white(href='/login') ログインページへ
</template>
<style>

</style>


