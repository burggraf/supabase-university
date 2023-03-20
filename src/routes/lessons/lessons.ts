import { supabase } from '$services/supabase.service';

export const getLessons = async (options: any) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', options.course_id)
    .order('created_at', { ascending: false });
  return { data, error };
}