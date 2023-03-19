<script lang="ts">
  import { onMount } from 'svelte'
    import { getCourses } from './courses';
    import { goto } from '$app/navigation';
    import { currentCourse } from '$services/course.service';

    import { currentUser } from '$services/supabase.auth.service';
	import * as allIonicIcons from 'ionicons/icons';

    let courses: any = [];
    onMount(async () => {
      const {data, error} = await getCourses({});
      if (error) console.error('error', error);
      else courses = data;
      console.log('courses', courses);
    });
    const gotoCourse = (course: any) => {
      console.log('gotoCourse', course);
      currentCourse.set(course);
      console.log('currentCourse', $currentCourse);
      console.log('courses going to /course now');
      goto(`/course`);
    };
    const gotoLessons = (course: any) => {
      console.log('gotoLessons', course);
      currentCourse.set(course);
      console.log('currentCourse', $currentCourse);
      goto(`/lessons`);
    };
</script>
<ion-header>
    <ion-toolbar translucent="true" color="primary">
        <ion-buttons slot="start">
            {#if $currentUser}
                <ion-menu-button />
            {:else}
                <ion-button on:click={()=>{goto('/')}} fill="clear" size="large">
                    <ion-icon size="large" color="primary" fill="clear" slot="icon-only" icon={allIonicIcons.arrowBackOutline} />
                </ion-button>	
            {/if}
        </ion-buttons>
        <ion-title>Courses</ion-title>
    </ion-toolbar>
</ion-header>
<ion-content>
    <ion-list>
        {#each courses as course}
        <ion-item on:click={gotoLessons(course)}>
            <ion-label>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
            </ion-label>
            <ion-button on:click|preventDefault|stopPropagation={gotoCourse(course)} slot="end" fill="clear" size="large">
                <ion-icon size="large" color="primary" fill="clear" slot="icon-only" icon={allIonicIcons.bookOutline} />
            </ion-button>
        </ion-item>
        {/each}
    </ion-list>    
</ion-content>
<style>

</style>