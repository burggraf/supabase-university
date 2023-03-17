import { supabase } from '$services/supabase.service';
import { currentUserId } from '$services/supabase.auth.service';

export const saveProfile = async (profile: any) => {
  if (!profile.id) {
    if (!currentUserId) {
      console.error('saveProfile error: no currentUserId');
      return;
    };
    profile.id = currentUserId;
  }
  const { data, error } = await supabase.from('profile').upsert(profile);
  return { data, error };
}

export const checkout = async (obj: any) => {
  const { data, error } = await supabase.functions.invoke('checkout', {
    body: {obj}
  })
    return { data, error }
}
export const portal = async (obj: any) => {
  const { data, error } = await supabase.functions.invoke('stripe-portal', {
    body: {obj}
  })
    return { data, error }
}

