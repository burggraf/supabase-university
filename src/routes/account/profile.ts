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
    // const { data, error } = 
    // await supabase.rpc('generate_lesson', { lessonid: id });
    return { data, error }
}
export const portal = async (obj: any) => {
  /**
    name: "Standard Plan"
    plan: "standard"
    promotion: "SELECTIT"
    promotion_type: ""
   */
  const { data, error } = await supabase.functions.invoke('stripe-portal', {
    body: {obj}
  })
    // const { data, error } = 
    // await supabase.rpc('generate_lesson', { lessonid: id });
    return { data, error }
}

export const getPlans = async () => {
  const { data, error } = await supabase.from('plans')
  .select('name,price,metadata,tag,interval')
  .order('sort_order', { ascending: true })
  return { data, error }

}