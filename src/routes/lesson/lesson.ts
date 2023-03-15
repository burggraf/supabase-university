import { supabase } from '$services/supabase.service';

export const getLesson = async (id: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
  return { data, error };
}