import { supabase } from '$services/supabase.service';
import { currentUser, currentProfile } from '$services/supabase.auth.service';

export const signOut = async () => {
    localStorage.clear();
    const { error } = await supabase.auth.signOut();
    currentUser.set(null);
    currentProfile.set(null);
    return { error };
  }
  