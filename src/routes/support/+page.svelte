<script lang="ts">
	import IonPage from '$ionpage';
	import { goto } from '$app/navigation';
	import * as allIonicIcons from 'ionicons/icons';
	import Login from '../../lib/components/Login/Login.svelte';
	import { currentUser } from '$services/supabase.auth.service';
    import { sendmail } from '$services/mailer.service';
    import { toast } from '$services/toast';
    import { loadingBox } from "$services/loadingMessage";

	let from: string = '';
	let subject: string = '';
	let message: string = ``;
	const validateEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};
	$: $currentUser && (from = $currentUser.email);
	const sendMessage = async () => {
		const loader = await loadingBox('Sending message...');
        const { data, error } = await sendmail({
          to: 'support@supau.org',
		  from,
		  subject,
          content: message,
          html: message.replace(/\n/g, '<br />'),
        //   file: {
        //     title: lesson.title + '.doc',
        //     data: doc }
        })
		if (!error) {
			loader.dismiss();
	        toast('Your message has been sent.', 'dark', 2000, 'top');
			message = '';
			subject = '';
			// console.log('message sent data', data);
		} else {
			loader.dismiss();
		}

	}

</script>

<IonPage>
	<ion-header>
		<ion-toolbar translucent="true" color="tertiary">
			<ion-buttons slot="start">
				{#if $currentUser}
					<ion-menu-button />
				{:else}
					<ion-button on:click={()=>{goto('/')}}>
						<ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
					</ion-button>	
				{/if}
			</ion-buttons>
			<ion-title>Supabase University Support</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<div class="center">
				<div class="box-400 border">
					<div class="ion-padding">
						<ion-label position="stacked">Your Email Address</ion-label>
						<ion-input
							name="from"
							on:ionChange={(e) => {
								from = e.detail.value;
							}}
							type="text"
							style="font-weight: normal;"
							placeholder="your email address"
							value={from}
							disabled={$currentUser}
						/>
						{#if !$currentUser && (!validateEmail(from) && from.length) > 0}
							<ion-row>
								<ion-col>
									<ion-label color="danger"><b>Invalid email format</b></ion-label>
								</ion-col>
							</ion-row>
						{/if}
						<ion-label position="stacked">Message Subject</ion-label>
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
							placeholder="type your message here"
							value={message}
							autoGrow={true}
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
				<div class="box-400">
					<br/>
					<ion-button
							fill="solid"
							color="secondary"
							size="large"
							on:click={sendMessage}
							disabled={(!validateEmail(from) || subject.trim().length === 0 || message.trim().length === 0)}
							expand="block">Send Message</ion-button>
							<br/>
						<Login
						signInButtonProps={
							{
								fill:"solid",
								color:"primary",
								size:"large",
								expand:"block",
								text:"Sign In"
							}
						}
						providers={['google', 'facebook']}
						onSignOut={() => {
							localStorage.clear();
							// goto('/');
							window.location.href = '/'
						}}
						onSignIn={() => {
							// goto('/');
						}}
						profileFunction={() => {
							//console.log('do some profileFunction here')
						}}
					/>
				</div>
	</ion-content>
</IonPage>

<style>
	ion-grid {
		width: 100%;
	}
	ion-label {
		font-weight: bold;
	}
	.center {
		max-width: 400px; 
		width: 400px;
		margin: auto;		
	}
	.box-400 {
		max-width: 400px;
		width: 400px;
	}
	.border {
		border: 1px solid;
	}
	.flex-item-no-border {
		max-width: 400px;
		width: 400px;
		cursor: pointer;
	}
	.flex-item {
		max-width: 400px;
		width: 400px;
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
