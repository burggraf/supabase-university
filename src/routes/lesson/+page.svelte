<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores';
  import { currentLesson } from '$services/lesson.service';
  import IonPage from '$ionpage';
    import { getLesson } from './lesson';
    let lesson: any = {};
    onMount(async () => {
        // get id from page params
        console.log('lesson says currentLesson is', $currentLesson);
        console.log('$page', $page);
        const { data, error } = await getLesson($currentLesson.id);
        if (error) console.error('error', error);
        else lesson = data;
        console.log('lesson', lesson);
    });
</script>
<IonPage>
    Title: {lesson.title}<br/>
    Description: {lesson.description}<br/>
    {@html lesson.content}    
</IonPage>
<style>
</style>