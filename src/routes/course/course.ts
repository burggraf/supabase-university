import { supabase } from '$services/supabase.service';

export const getCourse = async (id: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
  return { data, error };
}