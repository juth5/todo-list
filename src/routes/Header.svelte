<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import config from '$lib/scripts/config';
	import { logOut } from "$lib/scripts/auth";
	import { currentUser, authUser } from '$lib/scripts/firebase';
	import { awaitAuthReady } from "$lib/scripts/authStore";
	import { goto } from '$app/navigation';

  let src = '/no-image.png';

	let headerItems = [
		// {
		// 	label: 'logout',
		// 	action: () => logOut(),
		// },
		{
			action: () => goto(`/${$currentUser.uid}`),
		},
	];

	let icons = [
		{
			icon: '/book.svg',
			link: '/',
		},
	];

</script>

<template lang='pug'>
	header.fixed.t0.l0.z100.w-full.bg-black
		div.container-1240
			div.f.fm.fbw.h70.px20.text-white.fs16.s-h55.s-fs14
				a(href='/') home
				//- a.s-show(href='/')
				//- 	img.h30.block.object-fit-contain(src='/home.svg')
				+await('awaitAuthReady()')
						//- LoadingModal(show='{true}')
						+then('res')
							+if('$currentUser && $authUser')
								div.f.fm
									+each('headerItems as item')
										+if('item.label')
											button.button.rounded-30.bg-light-green.text-white.mr10.mr0-last(type='button', on:click='{item.action}') {item.label}
											+else
												div.s42.rounded-full.overflow-hidden.s-s36(type='button', on:click='{item.action}')
													img.block.object-fit-cover.s-full(src='{$authUser.icon_image || src}')
								//- div.f.fm.s-show
								//- 	+each('icons as icon')
								//- 		a.mr24.mr0-last(href='{icon.link}', target='blank')
								//- 			img.block.object-fit-contain.h30(src='{icon.icon}')
</template>


<style>

</style>
