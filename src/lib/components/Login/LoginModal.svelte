<script lang="ts">
	//  import SupabaseAuthService from "$services/supabase.auth.service";
	import { signUpWithEmail, sendMagicLink, signInWithEmail, resetPassword } from './LoginModal';
	import { modalController } from '$ionic/svelte';
	import LoginProviderSignInButton from './LoginProviderSignInButton.svelte';
	import type { Provider } from '@supabase/supabase-js';
	import { showConfirm } from '$services/alert.service';
	import { toast } from '$services/toast';
	import { loadingBox } from '$services/loadingMessage';
	export let providers: Provider[] = [];
	export let onSignIn: Function = () => {};
	//   const defineComponent = (tagName: string, customElement: any) => {
	//     if (typeof customElements === "undefined") return;

	//     if (!customElements.get(tagName)) {
	//         customElements.define(tagName, customElement);
	//     }
	// };

	import {
		mailOutline,
		closeOutline,
		personAdd,
		lockOpenOutline,
		lockClosedOutline,
		arrowForwardOutline,
		link
	} from 'ionicons/icons';
	import { onMount } from 'svelte';

	const logoColors: any = {
		google: 'rgb(227,44,41)',
		facebook: 'rgb(59,89,152)',
		spotify: 'rgb(36,203,75)',
		twitter: 'rgb(30,135,235)',
		apple: 'gray',
		slack: 'rgb(221,157,35)',
		twitch: 'rgb(120,34,244)',
		discord: 'rgb(116,131,244)',
		github: 'rgb(0,0,0)',
		bitbucket: 'rgb(56,98,169)',
		gitlab: 'rgb(209,44,30)',
		azure: 'rgb(228,54,26)',
		linkedin: 'rgb(2,119,181)',
		zoom: 'rgb(45,140,255)',
		notion: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'gray' : 'black'
	};
	let showModal = false;
	const closeOverlay = () => {
		modalController.dismiss({ data: Date.now() });
	};

	function handleEmailValue(event: any) {
		email = event.target.value!;
	}
	function handlePasswordValue(event: any) {
		password = event.target.value!;
	}

	const validateEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};
	const doResetPassword = async () => {
		const loader = await loadingBox('Requesting password reset link...');
		const { /*data,*/ error } = await resetPassword(email);
		if (error) {
			loader.dismiss();
			toast(error.message);
		} else {
			loader.dismiss();
			toast('Please check your email for a password reset link', 'dark', 5000);
		}
	};

	const doSignInWithEmail = async () => {
		const loader = await loadingBox('Logging in...');
		const { user, session, error } = await signInWithEmail(email, password);
		if (error) {
			console.error('error.message: ', error.message);
			if (error.message === 'Invalid login credentials') {
				loader.dismiss();
				await showConfirm({
					header: 'Invalid login credentials',
					message: `If you you have not already created an account, tap <b>OK</b> to create your account now.  If you've just typed an incorrect password, tap <b>Cancel</b> and try again.`,
					okHander: async () => {
						signUp();
					}
				});
			} else {
				toast(error.message, 'danger', 5000);
			}
		} else {
			loader.dismiss();
			showModal = false;
			modalController.dismiss({ data: Date.now() });
			if (onSignIn) {
				onSignIn(user, session);
			}
		}
	};

	const signUp = async () => {
		const loader = await loadingBox('Signing you up...');
		const { user, session, error } = await signUpWithEmail(email, password);
		if (user) {
			loader.dismiss();
			showModal = false;
			modalController.dismiss({ data: Date.now() });
			if (onSignIn) {
				onSignIn(user, session);
			}
		}
		if (error) {
			console.error(error);
			loader.dismiss();
			toast(error.message);
		} else {
			loader.dismiss();
			if (!session) {
				toast('Please check your email for a confirmation link', 'dark', 5000);
			}
		}
	};
	const toggleSignUpMode = () => {
		signUpMode = !signUpMode;
	};
	const doSendMagicLink = async () => {
		const loader = await loadingBox('Requesting magic link...');
		const { /*user, session,*/ error } = await sendMagicLink(email);
		if (error) {
			loader.dismiss();
			toast(error.message);
		} else {
			//setShowLoading(false);
			loader.dismiss();
			toast('Please check your email for a sign in link', 'dark', 5000);
		}
	};
	let email = '';
	let password = '';
	let signUpMode = false;
	const app_menu_title = __APP_MENU_TITLE__;

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

<ion-header translucent="true">
	<ion-toolbar id="selectorToolbar">
		<ion-title>{app_menu_title} Sign {#if signUpMode}Up{:else}In{/if}</ion-title>
		<ion-buttons slot="start">
			<ion-button on:click={closeOverlay}>
				<ion-icon
					slot="icon-only"
					icon={closeOutline}
				/>
			</ion-button>
		</ion-buttons>
	</ion-toolbar>
</ion-header>
<ion-content>
	<div id="selectorDiv" style="overflow-y: scroll;">
		<ion-grid class="ion-padding LoginGrid">
			<ion-row>
				<ion-col>
					<ion-label>Email Address</ion-label>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item class="loginItem" lines="none">
						<ion-input
							on:ionChange={handleEmailValue}
							class="loginInputBoxWithIcon"
							type="email"
							placeholder="Email"
						>
							<ion-icon
								class="inputIcon"
								icon={mailOutline}
								slot="start"
								size="large"
								color="medium"
							/>
						</ion-input>
					</ion-item>
				</ion-col>
			</ion-row>
			{#if !validateEmail(email) && email.length > 0}
				<ion-row>
					<ion-col>
						<ion-label color="danger"><b>Invalid email format</b></ion-label>
					</ion-col>
				</ion-row>
			{/if}
			<ion-row>
				<ion-col>
					<ion-label>Password</ion-label>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item class="loginItem" lines="none">
						<ion-input
							type="password"
							placeholder="Password"
							on:ionChange={handlePasswordValue}
							class="loginInputBoxWithIcon"
						>
							<ion-icon
								class="inputIcon"
								icon={password.length ? lockOpenOutline : lockClosedOutline}
								slot="start"
								size="large"
								color="medium"
							/>
						</ion-input>
					</ion-item>
					<div on:click={doResetPassword} class="ion-text-right" style="padding-top:10px">
						<ion-label><b>Forgot password?</b></ion-label>
					</div>
				</ion-col>
			</ion-row>
			{#if password.length > 0 && password.length < 6}
				<ion-row>
					<ion-col>
						<ion-label color="danger"><b>Password too short</b></ion-label>
					</ion-col>
				</ion-row>
			{/if}
			{#if !signUpMode}
				<ion-row>
					<ion-col>
						<ion-button
							expand="block"
							color="primary"
							disabled={!validateEmail(email) || password.length < 6}
							on:click={doSignInWithEmail}
						>
							<ion-icon icon={arrowForwardOutline} size="large" />&nbsp;&nbsp;
							<b>Sign in with email</b>
						</ion-button>
						<div
							on:click={toggleSignUpMode}
							class="ion-text-center"
							style="cursor: pointer;padding-top:10px"
						>
							<ion-label>Don't have an account? <b>Sign Up</b></ion-label>
						</div>
					</ion-col>
				</ion-row>
			{/if}
			{#if signUpMode}
				<ion-row>
					<ion-col>
						<ion-button
							expand="block"
							disabled={!validateEmail(email) || password.length < 6}
							on:click={signUp}
						>
							<ion-icon icon={personAdd} size="large" />&nbsp;&nbsp;
							<b>Sign Up</b></ion-button
						>
						<div
							on:click={toggleSignUpMode}
							class="ion-text-center"
							style="cursor: pointer;padding-top:10px"
						>
							<ion-label>Already have an account? <b>Sign In</b></ion-label>
						</div>
					</ion-col>
				</ion-row>
			{/if}
			<ion-row>
				<ion-col>
					<div class="ion-text-center" style="margin-bottom:10px">
						<ion-label><b>or</b></ion-label>
					</div>
					<ion-button
						expand="block"
						disabled={!validateEmail(email) || password.length > 0}
						on:click={doSendMagicLink}
					>
						<ion-icon icon={link} size="large" />&nbsp;&nbsp;
						<b>Send Sign In Link</b></ion-button
					>
				</ion-col>
			</ion-row>
		</ion-grid>
		{#if providers && providers.length > 0}
			<div class="ion-text-center">
				<ion-label>or, sign in with:</ion-label>
			</div>
		{/if}
		<ion-grid class="ion-padding ion-text-center ProvidersGrid">
			<ion-row>
				<ion-col>
					{#each providers as provider}
						<LoginProviderSignInButton name={provider} />
					{/each}
				</ion-col>
			</ion-row>
		</ion-grid>
	</div>
</ion-content>

<style>
	.LoginGrid {
		max-width: 375px;
	}
	.ProvidersGrid {
		max-width: 375px;
	}
	input:-webkit-autofill {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}

	input:-webkit-autofill:focus {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}

	.inputIcon {
		margin-left: 10px;
		margin-right: 10px;
	}

	.loginItem {
		--padding-start: 0px;
		--padding-end: 0px;
		--inner-padding-end: 0px;
	}
	.loginInputBoxWithIcon {
		height: 50px;
		border: 1px solid rgb(212, 212, 212);
		background-color: var(--ion-background-color) !important;
		border-radius: 5px;
	}
	.toast {
		font-weight: bold;
	}
	.flex-container {
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		flex-flow: row wrap;
		-webkit-flex-flow: row wrap;
		-moz-flex-flow: row wrap;
		justify-content: center;
	}
</style>
