import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export const get_supabase_client = (req: any) => {
    return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')!
        }
      }
    }
  )
}