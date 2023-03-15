<script lang="ts">
	import IonPage from '$ionpage';
	import { saveProfile, checkout, portal } from './profile';
	import {
		currentUser,
		currentProfile,
		currentPlan,
		loadPlan
	} from '$services/supabase.auth.service';
	import { onMount } from 'svelte';
	import { selectPlan } from '$services/utils.service';
	import { showConfirm, showAlert } from '$services/alert.service';
	import { goto } from '$app/navigation';
	import { loadingBox } from '$services/loadingMessage';
	import Plans from '$components/Plans.svelte';

	let changed = false;
	let plans: any = [];
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
	const chooseOrUpdatePlan = async (plan: string, name: string) => {
		console.log('chooseOrUpdatePlan', plan, name);
		const result = await selectPlan({
			plan,
			name,
			is_customer: $currentPlan.is_customer,
			plan_change_count: $currentPlan.plan_change_count
		});
		if (result) {
			console.log('selectPlan result', result);
			console.log('result.data', result.data);
			/**
			 *  name: "Standard Plan"
				plan: "standard"
				promotion: "SELECTIT"
				promotion_type: ""
			*/
			if ($currentPlan.is_customer && $currentPlan?.plan_change_count > 0) {
				const loader = await loadingBox('Contacting server...');
				const { data: portalData, error: portalError } = await portal(result?.data);
				loader.dismiss();
				if (portalError) {
					console.error('portal: error:', portalError);
				} else {
					if (portalData?.data) {
						goto(portalData.data);
					}
				}

			} else {
				const loader = await loadingBox('Contacting server...');
				const { data, error } = await checkout(result.data);
				console.log('got checkout data', data, 'error', error);
				loader.dismiss();
				if (error) {
					console.error('checkout: error:', error);
				} else {
					if (data?.data) {
						goto(data.data);
					} else {
						await showAlert({
							header: 'Success',
							message: 'Your subscription should now be active! Please wait a few seconds for the changes to take effect.'
						});
						loadPlan();
						setTimeout(loadPlan,5000);
						setTimeout(loadPlan,10000);
					}
				}
			}
		}
	}
	const OLDselectPlan = async (plan: string, name: string) => {
		if (plan === $currentPlan.plan) return;
		if ($currentPlan.is_customer && $currentPlan?.plan_change_count > 0) {
			await showConfirm({
				header: 'Switch to ' + name,
				message: `Would you like to switch to the <b>${name}</b> plan?`,
				okHander: async () => {
					//launchPortal();
				}
			});
		} else {
			await showConfirm({
				header: 'Subscribe to ' + name,
				message: `Would you like to subscribe to the <b>${name}</b> plan?`,
				okHander: async () => {
					const loader = await loadingBox('Contacting server...');
					const { data, error } = await checkout({ plan: plan });
					loader.dismiss();
					if (error) {
						console.error('checkout: error:', error);
					} else {
						if (data?.data) {
							goto(data.data);
						}
					}
				}
			});
		}
	};
	// const launchPortal = async (obj: any) => {
	// 	const loader = await loadingBox('Contacting server...');
	// 	const { data, error } = await portal();
	// 	loader.dismiss();
	// 	if (error) {
	// 		console.error('launchPortal: error:', error);
	// 	} else {
	// 		if (data?.data) {
	// 			goto(data.data);
	// 		}
	// 	}
	// };

	// onMount(async () => {
	// 	const { data, error } = await getPlans();
	// 	if (error) {
	// 		console.error('getPlans: error:', error);
	// 	} else {
	// 		plans = data;
	// 	}
	// });
	const ionViewWillEnter = async () => {
		await loadPlan();
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
					<ion-item lines="none" color="secondary">
						<ion-label class="ion-text-center"
							>You're currently on the <b>{$currentPlan.plan}</b> plan</ion-label
						>
					</ion-item>
					<ion-item lines="none" color="secondary">
						<ion-label class="ion-text-center"
							>from <b>{new Date($currentPlan.start_date).toLocaleDateString()}</b> to
							<b>{new Date($currentPlan.end_date).toLocaleDateString()}</b>.</ion-label
						>
					</ion-item>
					<ion-item lines="none" color="secondary">
						<ion-label class="ion-text-center"
							>(<b>{$currentPlan.credits_remaining}</b> credits available out of
							<b>{$currentPlan.credits_allowed}</b>)</ion-label
						>
					</ion-item>
					{#if $currentPlan.expired_plan && $currentPlan.expired_plan.length > 0}
						<ion-item lines="none" color="danger">
							<ion-label class="ion-text-center"
								>Your <b>{$currentPlan.expired_plan}</b> plan expired {new Date(
									$currentPlan.expires
								).toLocaleDateString()}.</ion-label
							>
						</ion-item>
					{/if}
					{#if $currentPlan.expired_plan.length === 0 && $currentPlan.expires}
						<ion-item lines="none" color="danger">
							<ion-label class="ion-text-center"
								>Your <b>{$currentPlan.expired_plan}</b> plan expires on {new Date(
									$currentPlan.expires
								).toLocaleDateString()}.<br />Click "Manage Subscription" now.</ion-label
							>
						</ion-item>
					{/if}
				</ion-list>
			</div>
			<br />

			<!-- {#if $currentPlan.is_customer}
				<div class="flex-container">
					<div class="flex-item-no-border">
						<ion-button expand="block" on:click={launchPortal}>Manage Subscription</ion-button>
					</div>
				</div>
			{/if} -->

			<br />
			<!-- <div class="ion-text-center">
				{#if $currentPlan.is_customer}
					<ion-label color="primary">Available Plans:</ion-label><br />
					<ion-label color="medium">(Generating a lesson uses 1 credit.)</ion-label>
				{:else}
					<ion-label>Select your plan to begin:</ion-label>
				{/if}
			</div> -->
			<br />
			<div class="selected" />
			<!--hack to get selected to show up-->
			<Plans {chooseOrUpdatePlan} />
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
