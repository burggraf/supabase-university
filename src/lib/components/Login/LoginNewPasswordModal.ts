import { supabase } from '$services/supabase.service';

export const updatePassword = async (new_password: string) => {
    const { error, data } = await supabase.auth
      .updateUser({ password: new_password });
    return { error, data };
  }
  