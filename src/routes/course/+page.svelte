<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores';
  import { currentCourse } from '$services/course.service';
  import IonPage from '$ionpage';
  import { getCourse, saveCourse } from './course';
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
	let changed = false;
	const save = async (e?: any) => {
		if (e) {
			if (course[e.target.name] !== e.target.value) changed = true;
			course[e.target.name] = e.target.value;
		}
		if (changed) {
			const { /*data,*/ error } = await saveCourse(course);
			if (error) {
				console.error('error saving course', error);
			} else {
				changed = false;
			}
		}
	};

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
    <div class="flex-container">
        <ion-list class="flex-item">
            <ion-item lines="none">
                <ion-label position="stacked">Title</ion-label>
                <ion-input
                    name="title"
                    debounce={500}
                    on:ionChange={save}
                    type="text"
                    placeholder="Course Title"
                    value={course.title}
                />
            </ion-item>
            <ion-item lines="none">
                <ion-label position="stacked">Tell us about yourself:</ion-label>
                <ion-input
                    name="description"
                    debounce={500}
                    on:ionChange={save}
                    type="text"
                    placeholder="Course Description"
                    value={course.description}
                />
            </ion-item>
        </ion-list>
    </div>



</ion-content>
</IonPage>
<style>
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

</style>