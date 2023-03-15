<script lang="ts">
	import { modalController } from '$ionic/svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from 'svelte';
	export let filetype: string = '';
	//export let name: string = '';
	export let lesson: any = {};
	let to: string = '';
	let subject: string = lesson.title + '.' + filetype.toLowerCase();
	let message: string = `Here is the ${lesson.type || lesson.item_type} I created titled: "${lesson.title}".`;
	const validateEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

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
			<ion-button 
				disabled={!validateEmail(to) || subject.trim().length === 0 || message.trim().length === 0} 
				on:click={()=>{selectItem({to,subject,message})}}>
				<ion-icon
					slot="icon-only"
					icon={allIonicIcons.checkmarkOutline}
				/>
			</ion-button>
		</ion-buttons>
		<ion-title>{`Email as ${filetype === 'DOC' ? 'MS Word' : (filetype.startsWith('PPT')) ? 'Powerpoint' : filetype}`}</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<div id="selectorDiv" style="overflow-y: scroll;">
		<div class="ion-padding width-400">
			<ion-label position="stacked">Send to email</ion-label>
			<ion-input
				name="to"
				on:ionChange={(e) => {
					to = e.detail.value;
				}}
				type="text"
				style="font-weight: normal;"
				placeholder="email address of recipient"
				value={to}
			/>
			{#if !validateEmail(to) && to.length > 0}
				<ion-row>
					<ion-col>
						<ion-label color="danger"><b>Invalid email format</b></ion-label>
					</ion-col>
				</ion-row>
			{/if}
			<ion-label position="stacked">Message subject</ion-label>
			<ion-input
				name="subject"
				on:ionChange={(e) => {
					subject = e.detail.value;
				}}
				type="text"
				style="font-weight: normal;"
				placeholder="message subject"
				value={subject}
			/>
			{#if subject.trim().length === 0}
				<ion-row>
					<ion-col>
						<ion-label color="danger"><b>Subject is required</b></ion-label>
					</ion-col>
				</ion-row>
			{/if}

			<ion-label position="stacked">Message</ion-label>
			<ion-textarea
				rows={10}
				name="message"
				on:ionChange={(e) => {
					message = e.detail.value;
				}}
				type="text"
				style="font-weight: normal;"
				placeholder="email message"
				value={message}
			/>
			{#if message.trim().length === 0}
				<ion-row>
					<ion-col>
						<ion-label color="danger"><b>Message is required</b></ion-label>
					</ion-col>
				</ion-row>
			{/if}


		</div>
	</div>
</ion-content>

<style>
	ion-textarea {
		border: 1px solid lightgray;
		--padding-start: 10px;
		--padding-end: 10px;
	}
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
