import { supabase } from '$services/supabase.service';
import { gen_random_uuid } from '$services/utils.service';
export const getCourse = async (id: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
  return { data, error };
}

export const saveCourse = async (course: any) => {
  console.log('saveCourse', course)
  if (!course.id) {
    course.id = gen_random_uuid();
  }
  const { data, error } = await supabase.from('courses').upsert(course);
  return { data, error };
}

