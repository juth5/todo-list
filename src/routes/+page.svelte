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
	
	let isOpenModal = false;
	let todoList = [];
	let text = '';
	let inputElement = {};
	let isLoading = false;
	let isLogin = null;
	$: ({ diaries } = $page.data);

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
			const docRef = await addDoc(collection(firebaseDb, "diary"), {
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
				let ref = doc(firebaseDb, "diary", data.id);
				return deleteDoc(ref);
			});

			await Promise.all(promises);

			diaries = diaries;
		};

		// let getData = async () => {
		// 	try {
		// 		if ($currentUser) {
		// 			const userId = $currentUser.uid;
					
		// 			const diaryCollection = collection(firebaseDb, "diary");
		// 			const q = query(diaryCollection, where("uid", "==", userId));
		// 			const querySnapshot = await getDocs(q);

		// 			querySnapshot.forEach((doc) => {
		// 				todoList.push({ id: doc.id, ...doc.data() }); // ドキュメントIDを含める
		// 		});

		// 		todoList = todoList.map((list) => {
		// 			return {
		// 				data: list,
		// 				isChecked: false,
		// 			}
		// 		});

		// 		console.log(todoList,'hoge')

		// 		}
		// 	}
		// 	catch(e) {
		// 		console.error(e);
		// 	}
		// };

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
						h1.text-center.mb40 TODO List
						form.mb50(on:submit!='{(e) => insertContent(e)}')
							h3.mb12 TODO
							div.f.fm.s-flex-column
								input.input.border.w-full.rounded-30.px20.mr24.s-mr0.s-mb12(bind:value='{text}', bind:this='{inputElement}')
								div.f.s-fr.s-w-full
									button.button.flex-fixed.rounded-20.w128.bg-light-green.text-white 追加
						h3.mb12 TODO 一覧 ({diaries.length})
						div.mb30
							+each('diaries as diary, index')
								div.f.fm
									div.w10.mr12 {index + 1}.
									input.w20.mr12(type='checkbox', bind:checked='{diary.isChecked}')
									li {diary.data.content}
						+if('diaries.length')
							div.f.fr
								div
									div.mb12 終了したtodoは☑️！完了を押して消そう👍
									div.f.fr
										button.button.rounded-20.w128.bg-light-green.text-white(on:click!='{() => saveTodoList()}') 完了
					+if('isOpenModal')
						AuthModal(show='{isOpenModal}', onClose='{closeModal}')
					+else
						div.f.fh.s-full
							a.w256.rounded-30.bg-light-green.p10.text-center.text-white(href='/login') ログインページへ
</template>
<style>

</style>


