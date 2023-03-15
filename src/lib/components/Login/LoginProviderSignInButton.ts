import { supabase } from '$services/supabase.service';
import type { Provider } from '@supabase/supabase-js';

export const signInWithProvider = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin // .origin
      }
    });
    return { data, user: null, session: null, error };
  }
  