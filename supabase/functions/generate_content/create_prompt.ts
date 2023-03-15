import { prompt as deck } from './prompts/deck.ts';
import { prompt as discussion } from './prompts/discussion.ts';
import { prompt as notes } from './prompts/notes.ts';
import { prompt as quiz } from './prompts/quiz.ts';
import { prompt as songs } from './prompts/songs.ts';
import { prompt as lesson } from './prompts/lesson.ts';
const promptTemplates: any = {};
promptTemplates.lesson = lesson;
promptTemplates.deck = deck;
promptTemplates.discussion = discussion;
promptTemplates.notes = notes;
promptTemplates.quiz = quiz;
promptTemplates.songs = songs;

export const createPrompt = (item_type: string, lessonData: any, options: any) => {
    try {
        const fullPrompt = promptTemplates[item_type](lessonData, options);
        console.log('func got fullPrompt', fullPrompt)
        if (!fullPrompt || fullPrompt.length === 0) {
            return { prompt: null, error: 'Error generating prompt.' }
        } else {
            return { prompt: fullPrompt, error: null }
        }
    } catch (error) {
        return { prompt: null, error }
    }
}


