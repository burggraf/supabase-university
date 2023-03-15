export const prompt = (lessonData: any, options: any) => {
let fullPrompt =
`Create a set of powerpoint slides, each with a short title and a short block of text.  
Each text block should be a very concise summary of the point, and should not be too verbose.  
The powerpoint deck should accompany the following ${lessonData?.settings?.type || 'Lesson'}:

${lessonData?.content || ''}
`;
    
    return fullPrompt;
}
