import { supabase } from '$services/supabase.service';

export const getLessons = async (options: any) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}