<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores';
  import { currentCourse } from '$services/course.service';
  import IonPage from '$ionpage';
  import { getCourse } from './course';
  import { goto } from '$app/navigation'
  import { currentUser } from '$services/supabase.auth.service';
	import * as allIonicIcons from 'ionicons/icons';

    let course: any = {};
    onMount(async () => {
        console.log('course onMount');
        // get id from page params
        if (!$currentCourse) {
            const lastCourse = localStorage.getItem('lastCourse');
            if (lastCourse) {
                currentCourse.set({id: lastCourse});
            }
        }
        console.log('course says currentCourse is', $currentCourse)
        if (!$currentCourse) {
            console.log('no currentCourse');
            goto('/courses');
            return;
        }
        console.log('course says currentCourse is', $currentCourse);
        console.log('$page', $page);
        const { data, error } = await getCourse($currentCourse.id);
        if (error) console.error('error', error);
        else course = data;
        console.log('course', course);
        localStorage.setItem('lastCourse', course.id)
    });
</script>
<IonPage>
    <ion-header>
        <ion-toolbar translucent="true" color="primary">
            <ion-buttons slot="start">
                    <ion-button on:click={()=>{goto('/courses')}}>
                        <ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
                    </ion-button>	
            </ion-buttons>
            <ion-title>Course</ion-title>
        </ion-toolbar>
    </ion-header>
<ion-content>    
    <div class="ion-padding" style="width: 100%; height: 100%;">
            <h2>Title: {course.title}<br/></h2>
            <h3>Description: {course.description}<br/></h3>
        <br/><br/><br/>
    </div>
</ion-content>
</IonPage>
<style>
</style>