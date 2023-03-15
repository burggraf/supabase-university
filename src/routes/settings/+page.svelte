<script lang="ts">
	import IonPage from '$ionpage';
	import { goto } from '$app/navigation';
	// goto('/components/Splash');
	import { selectLessonType } from '../lesson/lesson'
	// import {
	// } from '$services/utils.service';

	import { currentUser, currentProfile, loadUser, loadProfile } from '$services/supabase.auth.service';
	import { saveProfile } from '../account/profile';

	const settings: any = {
		};


	const saveSettings = async () => {
		// merge settings into currentProfile
		const newProfile = {...$currentProfile, settings};
		currentProfile.set(newProfile)
		saveProfile(newProfile);
	}
	const ionViewWillEnter = async () => {
		if (!$currentProfile) {
			await loadProfile($currentUser?.id);
			setup();
		} else {
			setup();
		}
	}
	const setup = async () => {
		if ($currentProfile?.settings) {
			settings.type = $currentProfile.settings.type || 'some type here';
		}
	}
</script>
<IonPage {ionViewWillEnter}>
	<ion-header>
	<ion-toolbar color="secondary">
		<ion-buttons slot="start">
			<ion-menu-button />
		</ion-buttons>
		<ion-title>Supabase University Settings</ion-title>
	</ion-toolbar>
</ion-header>
<ion-content class="ion-padding">

</ion-content>
</IonPage>
