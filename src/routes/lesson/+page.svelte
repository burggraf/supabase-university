<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores';
  import { currentLesson } from '$services/lesson.service';
  import IonPage from '$ionpage';
  import { getLesson } from './lesson';
  import { goto } from '$app/navigation'
  import { currentUser } from '$services/supabase.auth.service';
	import * as allIonicIcons from 'ionicons/icons';

    let lesson: any = {};
    onMount(async () => {
        // get id from page params
        if (!$currentLesson) {
            const lastLesson = localStorage.getItem('lastLesson');
            if (lastLesson) {
                currentLesson.set({id: lastLesson});
            }
        }
        if (!$currentLesson) {
            console.log('no currentLesson');
            goto('/lessons');
            return;
        }
        console.log('lesson says currentLesson is', $currentLesson);
        console.log('$page', $page);
        const { data, error } = await getLesson($currentLesson.id);
        if (error) console.error('error', error);
        else lesson = data;
        console.log('lesson', lesson);
        localStorage.setItem('lastLesson', lesson.id)
    });
</script>
<IonPage>
    <ion-header>
        <ion-toolbar translucent="true" color="primary">
            <ion-buttons slot="start">
                    <ion-button on:click={()=>{goto('/lessons')}}>
                        <ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
                    </ion-button>	
            </ion-buttons>
            <ion-title>Lesson</ion-title>
        </ion-toolbar>
    </ion-header>
<ion-content>    
    <div class="ion-padding" style="width: 100%; height: 100%;">
            <h2>Title: {lesson.title}<br/></h2>
            <h3>Description: {lesson.description}<br/></h3>
            {@html lesson.content}
        <br/><br/><br/>
    </div>
</ion-content>
</IonPage>
<style>
</style>