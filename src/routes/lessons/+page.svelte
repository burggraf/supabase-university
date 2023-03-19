<script lang="ts">
  import { onMount } from 'svelte'
    import { getLessons } from './lessons';
    import { goto } from '$app/navigation';
    import { currentLesson } from '$services/lesson.service';
    import { currentCourse } from '$services/course.service';

    import { currentUser } from '$services/supabase.auth.service';
	import * as allIonicIcons from 'ionicons/icons';

    let lessons: any = [];
    onMount(async () => {
      const {data, error} = await getLessons({});
      if (error) console.error('error', error);
      else lessons = data;
      console.log('lessons', lessons);
    });
    const gotoLesson = (id: string) => {
      console.log('gotoLesson', id);
      currentLesson.set({id});
      console.log('currentLesson', $currentLesson);
      goto(`/lesson`);
    };
</script>
<ion-header>
    <ion-toolbar translucent="true" color="primary">
        <ion-buttons slot="start">
            {#if $currentUser}
            <ion-button on:click={()=>{goto('/courses')}}>
                <ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
            </ion-button>	
        {:else}
                <ion-button on:click={()=>{goto('/')}}>
                    <ion-icon slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
                </ion-button>	
            {/if}
        </ion-buttons>
        <ion-title>{$currentCourse.title}</ion-title>
    </ion-toolbar>
</ion-header>
<ion-content>
    <ion-list>
        {#each lessons as lesson}
        <ion-item on:click={gotoLesson(lesson.id)}>
            <ion-label>
                <h2>{lesson.title}</h2>
                <p>{lesson.description}</p>
            </ion-label>
        </ion-item>
        {/each}
    </ion-list>    
</ion-content>
<style>

</style>