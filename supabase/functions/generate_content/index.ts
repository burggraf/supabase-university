import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

import { createCompletion } from './create_completion.ts'
import { createPrompt } from './create_prompt.ts'
import { headers } from './headers.ts'
import { RESPONSE } from './response.ts'
import { get_supabase_client } from './supabase_client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers
    })
  }
  const {
    id, item_type, options
  } = await req.json()

  const supabase = get_supabase_client(req);
  const { data: { user },} = await supabase.auth.getUser()
  if (!user) {
    return RESPONSE({ error: 'User not found' });
  }

  const { data: creditData, error: creditError} = await supabase
  .rpc('get_my_plan');
  if (creditError) {
    return RESPONSE({ error: creditError})
  }
  if (creditData?.credits_remaining <= 0) {
    return RESPONSE({ error: 'Over quota: not enough credits to generate this item' })
  }

  const { data: lessonData, error: lessonError } = await supabase
    .from('lessons')
    .select('title,description,settings,content')
    .eq('id', id)
    .eq('userid', user.id)
    .limit(1)
    .single();
  if (lessonError) {
    return RESPONSE({ error: lessonError})
  } else {
    if (item_type !== 'lesson' && (lessonData?.content || '').length < 5) {
      return RESPONSE({ error: 'Content is missing.' })
    }

    const { prompt, error: promptError } = createPrompt(item_type, lessonData, options);
    if (promptError) {
      return RESPONSE({ error: promptError }) 
    }

    const start_time = +new Date();
    const { data, error } = await createCompletion(prompt, item_type)
    if (error) {
      return RESPONSE({ error })
    }
    const end_time = +new Date();
    const results = await data?.json(); // JSON.parse(baseText || '{}');
    results.status = data?.status;
    results.uid = user.id;
    results.prompt = prompt;
    
    results.result = results?.choices[0]?.message?.content?.replace(/\n/g,'') || '';
    results.lesson_id = id;
    if (item_type !== 'lesson') {
      results.lesson_title = item_type.toUpperCase() + ': ' + (lessonData?.title || '');
    } else {
      results.lesson_title = (lessonData?.title || '');
    }
    results.start_time = start_time;
    results.end_time = end_time;
    results.duration = end_time - start_time;
    results.item_type = item_type;

    const { data: logData, error: logError } = 
      await supabase.rpc('log_completion', { retval: results });
    if (logError) {
      console.log('log_completion', logError)
      return RESPONSE({ error: logError })
    }


    let newID = '';
    if (item_type === 'lesson') {
      const { data: lessonUpdateData, error: lessonUpdateError } =
        await supabase.from('lessons').update({
          content: results?.choices[0]?.message?.content || '',
          updated_at: 'now()'
        }).eq('id', id).eq('userid', user.id).single();
      if (lessonUpdateError) {
        return RESPONSE({ error: lessonUpdateError })
      } else {
        newID = lessonUpdateData?.id;
      }
    } else {
      const { data: lessonUpdateData, error: lessonUpdateError } =
        await supabase.from('lessons').insert({
          userid: user.id,
          item_type: item_type,
          title: item_type.toUpperCase() + ': ' + lessonData?.title || '',
          description: lessonData?.description || '',
          settings: {},
          folder: id, // lesson id was sent as a parameter to this function
          content: results?.choices[0]?.message?.content || '',
          updated_at: 'now()'
        }).select();
      if (lessonUpdateError) {
        return RESPONSE({ error: lessonUpdateError })
      } else {
        newID = lessonUpdateData?.id;
      }
    }



    return RESPONSE({
        data: { "content": results?.choices[0]?.message?.content || '', "id": newID }
      })
  }

})
