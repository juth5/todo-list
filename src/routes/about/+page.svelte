	<script>
		import { collection, addDoc, updateDoc, doc, query, getDocs, where, deleteDoc } from "firebase/firestore"; 
		import { signUp, logOut , logIn, getToken } from "$lib/scripts/auth";
		import { firebaseDb } from '$lib/scripts/firebase';
		import { currentUser, authUser } from '$lib/scripts/firebase';


		let name = '';
		let email = '';
		let password = '';

		let loginEmail = '';
		let loginPassword = '';

		let content = '';
		let contents = ['oo'];
		let todoList = [
			
		];
	
		let submit = (e) => {
			e.preventDefault();
			signUp(email, password);
		};

		let signIn = (e) => {
			e.preventDefault();
			logIn(loginEmail, loginPassword);
		};

		let insertContent = async (e) => {
			e.preventDefault();
			const docRef = await addDoc(collection(firebaseDb, "diary"), {
				content: content,
				uid: $currentUser.uid,
				created_at: new Date()
			});
			contents.push(content);
			contents = contents;
			console.log(contents,'gege')
			content = '';
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


		$: {
			if ($currentUser) {
				console.log($currentUser.displayName)
			}
			console.log();
			contents;
		}
	</script>
<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>
<template lang='pug'>
	div.f.fh.h100vh
		div.f.fm
			form.border(on:submit!='{(e) => submit(e)}')
				div email
				input(type='email', bind:value='{email}').input
				div password
				input(type='password', bind:value='{password}').input
				button.button  button
			form(on:submit!="{(e) => signIn(e)}")
				div メール
				input.input(type='email', bind:value='{loginEmail}')
				div パスワード
				input.input(type='password', bind:value='{loginPassword}')
				button.button button
			form(on:submit!='{(e) => insertContent(e)}')
				div 今日やること
				input.input(type='content', bind:value='{content}')
				button.button button
			+if('contents.length')
				+each('todoList as list')
					div.f.fm
						input(type='checkbox', bind:checked='{list.isChecked}')
						li {list.data.content}
			button.button(on:click!='{() => saveTodoList()}') deleteDat
			button.button(on:click!='{() => getData()}') getData



			
		+if('$currentUser')
			div {$currentUser.uid}
		


</template>
<style>

</style>

