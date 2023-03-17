export const createCompletion = async (prompt: string, options: any) => {
    try {
      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`, 
        {
          body: JSON.stringify({
            model: options.model || 'gpt-3.5-turbo',
            messages: [{"role": "user", "content": prompt}],
            temperature: options.temperature || 0.0, // 1.0,
            max_tokens: option.max_tokens || 3000,
            top_p: options.top_p || 1,
            frequency_penalty: options.frequency_penalty || 0.0,
            presence_penalty: options.presence_penalty || 0.0
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
  