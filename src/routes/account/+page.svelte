<script lang="ts">
	import IonPage from '$ionpage';
	import { saveProfile, checkout, portal } from './profile';
	import {
		currentUser,
		currentProfile,
	} from '$services/supabase.auth.service';
	import { onMount } from 'svelte';
	import { showConfirm, showAlert } from '$services/alert.service';
	import { goto } from '$app/navigation';
	import { loadingBox } from '$services/loadingMessage';

	let changed = false;
	const save = async (e?: any) => {
		if (e) {
			if ($currentProfile[e.target.name] !== e.target.value) changed = true;
			$currentProfile[e.target.name] = e.target.value;
		}
		if (!$currentProfile.id) {
			$currentProfile.id = $currentUser.id;
		}
		if (changed) {
			const { /*data,*/ error } = await saveProfile($currentProfile);
			if (error) {
				console.error('error saving profile', error);
			} else {
				changed = false;
			}
		}
	};
	const ionViewWillEnter = async () => {
	};
</script>

<IonPage {ionViewWillEnter}>
	<ion-header>
		<ion-toolbar translucent="true" color="tertiary">
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Account</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		{#if $currentUser}
			<div class="flex-container">
				<ion-list class="flex-item">
					<ion-item lines="none">
						<ion-label position="stacked">Name</ion-label>
						<ion-input
							name="name"
							debounce={500}
							on:ionChange={save}
							type="text"
							placeholder="Tell us your name"
							value={$currentProfile?.name}
						/>
					</ion-item>
					<ion-item lines="none">
						<ion-label position="stacked">Tell us about yourself:</ion-label>
						<ion-input
							name="bio"
							debounce={500}
							on:ionChange={save}
							type="text"
							placeholder="Tell us how you plan to use Supabase"
							value={$currentProfile?.bio}
						/>
					</ion-item>
				</ion-list>
			</div>
			<br />

			<div class="selected" />
			<!--hack to get selected to show up-->
		{:else}
			<div style="width: 400px; margin: auto;">
				<div class="ion-text-center" style="width: 400px;">
					<ion-label color="primary">You are not logged in.</ion-label>
					<br /><br />
					<ion-button expand="block" href="/">Get started now.</ion-button>
				</div>
			</div>
		{/if}
	</ion-content>
</IonPage>

<style>
	ion-grid {
		width: 100%;
	}
	ion-label {
		font-weight: bold;
	}
	.flex-item-no-border {
		max-width: 500px;
		width: 500px;
		cursor: pointer;
	}
	.flex-item {
		max-width: 500px;
		width: 500px;
		border: 1pt solid;
		cursor: pointer;
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
	.price {
		font-size: 0.8em;
		text-align: right;
	}
	p {
		font-size: 0.8em;
	}
	.selected {
		background-color: #f0f0f0;
		cursor: default;
	}
	.unselected:hover {
		background-color: var(--ion-color-tertiary);
		color: var(--ion-color-tertiary-contrast);
		transition: 0.2s;
	}
</style>
