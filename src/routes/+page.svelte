<script lang="ts">
	import { currentUser, currentProfile } from '$services/supabase.auth.service';
	import { goto } from '$app/navigation';
	import { currentLesson } from '$services/lesson.service';
	import Login from '../lib/components/Login/Login.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import videos from './videos.json';
	let videoIndex = 0;
	const createLesson = () => {
		currentLesson.set({});
		goto('/lesson');
	};
	const listLessons = () => {
		goto('/lessons');
	};
	// goto('/components/Splash');
</script>
<ion-header>
	{#if $currentUser}
	<ion-toolbar color="primary">
		<ion-buttons slot="start">
				<ion-menu-button />
		</ion-buttons>
		<ion-title>Welcome</ion-title>
	</ion-toolbar>
	{/if}
</ion-header>
<ion-content class="ion-padding">
	<div class="width-400">
		{#if $currentUser}
		<div class="ion-text-center" style="margin-top: -30px;">
			<ion-grid>
				<ion-row>
					<ion-col size="auto">
						<ion-img style="height: 40px; width:40px; margin-left:10px; margin-right: 10px; margin-top: 30px;" src="/assets/icon-128.png"></ion-img>
					</ion-col>
					<ion-col size="auto">
						<h1>Supabase University</h1>
						<p>Learn Supabase</p>			
					</ion-col>
				</ion-row>
			</ion-grid>
		</div>
			<div class="center">
				Welcome back <b>{$currentProfile?.name || $currentUser.email}</b>.
			</div><br/>
	{:else}
		
		<div class="ion-text-center">
			<ion-grid>
				<ion-row>
					<ion-col size="auto">
						<ion-img style="height: 40px; width:40px; margin-left:10px; margin-right: 10px; margin-top: 30px;" src="/assets/icon-128.png"></ion-img>
					</ion-col>
					<ion-col size="auto">
						<h1>Welcome to Supabase University</h1>
						<p>Learn Supabase</p>			
					</ion-col>
				</ion-row>
			</ion-grid>
		<Login
			signInButtonProps={
				{
					fill:"solid",
					color:"primary",
					size:"large",
					expand:"block",
					text:"Get Started Now for Free"
				}
			}
			providers={['google', 'facebook']}
			onSignOut={() => {
				localStorage.clear();
				// goto('/');
				window.location.href = '/'
			}}
			onSignIn={() => {
				// goto('/lessons');
			}}
			profileFunction={() => {
				//console.log('do some profileFunction here')
			}}
		/>
		</div>
	{/if}
</div>
<br/><br/><br/><br/>&nbsp;
</ion-content>
<ion-footer>
	{#if !$currentUser}
	<ion-toolbar color="transparent" class="ion-text-center">
		<span on:click={()=>{goto('/terms')}} class="pointer">Terms of Service</span>
		<ion-icon icon={allIonicIcons.ellipseSharp} size="small" class="padded"/>
		<span on:click={()=>{goto('/privacy')}} class="pointer">Privacy</span>
		<ion-icon icon={allIonicIcons.ellipseSharp} size="small" class="padded"/>
		<span on:click={()=>{goto('/support')}} class="pointer">Support</span>
	</ion-toolbar>
	{/if}
</ion-footer>
<style>
	.padded {
		padding-left: 5px;
		padding-right: 5px;
	}
	.center {
		text-align: center;
		font-size: 1.2em;
	}
	.width-400 {
		max-width: 400px; 
		width: 400px;
		margin: auto;		
	}
	h3 {
		text-align: center;
	}

	.flex-item-no-border {
		max-width: 400px; 
		width: 400px;
		cursor: pointer;
	}
	.flex-item {
		max-width: 400px; 
		width: 400px;
		/* border: 1pt solid; */
		cursor: pointer;
		margin: 10px;
		padding-top: 0px;
		padding-bottom: 10px;
		padding-left: 20px;
		padding-right: 20px;
	}
	.primary {
		color: var(--ion-color-primary-contrast);
		background-color: var(--ion-color-primary);
	}
	.secondary {
		color: var(--ion-color-secondary-contrast);
		background-color: var(--ion-color-secondary);
	}
	.tertiary {
		color: var(--ion-color-tertiary-contrast);
		background-color: var(--ion-color-tertiary);
	}

	.flex-container {
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		flex-flow: row nwrap;
		-webkit-flex-flow: row wrap;
		-moz-flex-flow: row wrap;
		justify-content: center;
	}
	.pointer {
		cursor: pointer;
	}


</style>