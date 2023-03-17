import { prompt as deck } from './prompts/deck.ts';
const promptTemplates: any = {};
promptTemplates.deck = deck;

export const createPrompt = (promptData: any, options: any) => {

    return { prompt: `prompt goes here`, error: null }

}


