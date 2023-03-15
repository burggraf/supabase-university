<script lang="ts">
	import { modalController } from '$ionic/svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { selectFolder } from '$services/utils.service';
	import { updateFolderParent } from '$services/folder.service';
	import { onMount } from 'svelte';
	export let name: string = '';
	export let id: string = '';
	export let editMode: boolean = false;
	export let isEmpty: boolean = false;

	const selectItem = (item: any) => {
		modalController.dismiss(item);
	};
	onMount(() => {
		setTimeout(() => {
			const thing =
				document.getElementById('selectorDiv')?.parentElement?.parentElement?.parentElement ||
				({} as any);
			const toolbar = document.getElementById('selectorToolbar') || ({} as any);
			const h = thing?.clientHeight - toolbar?.clientHeight + 'px';
			const obj1 = document.getElementById('selectorDiv')?.parentElement?.parentElement?.style;
			const obj2 = document.getElementById('selectorDiv')?.parentElement?.style;
			const obj3 = document.getElementById('selectorDiv')?.style;
			if (obj1) obj1.height = h;
			if (obj2) obj2.height = h;
			if (obj3) obj3.height = h;
		}, 200);
	});
	const moveToFolder = async () => {
		const data = await selectFolder();
		if (typeof data?.data === 'string') {
			const moveError = await updateFolderParent(id, (data?.data === '') ? null : data?.data);
			if (moveError) {
				console.error('error moving folder', moveError);
			}
		} else {
			console.log('aborted moveToFolder, data', data?.data);
		}
	}


</script>

<ion-header>
	<ion-toolbar color="tertiary" id="selectorToolbar">
		<ion-buttons slot="start">
			<ion-button
				on:click={() => {
					selectItem(null);
				}}
			>
				<ion-icon slot="icon-only" icon={allIonicIcons.closeOutline} />
			</ion-button>
		</ion-buttons>
		<ion-buttons slot="end">
			<ion-button on:click={()=>{selectItem(name)}}>
				<ion-icon
					slot="icon-only"
					icon={allIonicIcons.checkmarkOutline}
				/>
			</ion-button>
		</ion-buttons>
		<ion-title>{editMode ? 'Edit' : 'Create'} Folder</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<div id="selectorDiv" style="overflow-y: scroll;">
		<div class="ion-padding width-400">
			<ion-label position="stacked">Folder Name</ion-label>
			<ion-input
				name="title"
				on:ionChange={(e) => {
					name = e.detail.value;
				}}
				type="text"
				style="font-weight: normal;"
				placeholder="type folder name here"
				value={name}
			/>
		</div>

		{#if id.length > 0}
			<br/><br/>
			<div class='ion-padding width-400'>
			<ion-button
				expand="block"
				color="warning"
				on:click={() => {
					moveToFolder();
				}}>Move This Folder</ion-button>
			</div>
		{/if}

		{#if isEmpty}
			<br/><br/>
			<div class='ion-padding width-400'>
			<ion-button
				expand="block"
				color="danger"
				on:click={() => {
					selectItem('[DELETE THIS FOLDER]');
				}}>Delete This Folder</ion-button>
			</div>
		{/if}
	</div>
</ion-content>

<style>
	.width-400 {
		max-width: 400px; 
		width: 400px;
		margin: auto;		
	}
	ion-input {
		border: 1px solid lightgray;
		--padding-start: 10px;
	}
	.selected {
		--background: #e0e0e0;
		background-color: #e0e0e0;
		color: black;
	}
</style>
