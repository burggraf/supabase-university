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
    <div class="ion-padding" style="width: 100%; height: 100%;">
            <h2>Title: {lesson.title}<br/></h2>
            <h3>Description: {lesson.description}<br/></h3>
            {@html lesson.content}
        <br/><br/><br/>
    </div>
</IonPage>
<style>
</style>