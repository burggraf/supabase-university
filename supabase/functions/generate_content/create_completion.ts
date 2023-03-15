export const createCompletion = async (prompt: string, item_type: string) => {
    try {
      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`, 
        {
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{"role": "user", "content": prompt}],
            temperature: 1.0,
            max_tokens: item_type === 'lesson' ? 3000 : 1200,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
            //best_of: 1
          }),
          headers: {
            Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      if (!response.ok) {
        return {
          data: null,
          error: {
            ok: response.ok,
            redirected: response.redirected,
            status: response.status,
            statusText: response.statusText,
            url: response.url          
          }
        }
      } else {
        return {
          data: response,
          error: null
        }
      }
    } catch (err) {
      return {
        data: null,
        error: err
      }
    }
  }
  