import { supabase } from '$services/supabase.service';

export const getCourses = async (options: any) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('title', { ascending: true });
  return { data, error };
}