<script lang="ts">
  import { onMount } from 'svelte'
    import { getLessons } from './lessons';
    import { goto } from '$app/navigation';
    import { currentLesson } from '$services/lesson.service';
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