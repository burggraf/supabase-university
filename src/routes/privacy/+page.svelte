<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$services/supabase.auth.service';
	import * as allIonicIcons from 'ionicons/icons';
	// goto('/components/Splash');
</script>
<ion-header>
	<ion-toolbar color="primary">
        <ion-buttons slot="start">
            {#if $currentUser}
                <ion-menu-button />
            {:else}
                <ion-button on:click={()=>{goto('/')}}>
                    <ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
                </ion-button>	
            {/if}
		</ion-buttons>
		<ion-title>Privacy Policy</ion-title>
	</ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
    <div class="inner-div">
    <h1>Privacy Policy</h1>
    
</div>
</ion-content>

<style>
    .inner-div {
        margin:40px;
    }
    ion-content {
        font-size: 1.2em;
    }
    p {
        font-size: 1em;
        /* margin-bottom: 1em; */
    }
    li {
        font-size: 1em;
        margin-bottom: 1em;
    }
</style>












