import { supabase } from '$services/supabase.service';
import { writable } from 'svelte/store';

export let currentFolder: any = writable<string|null>(null);

export const getFolders = async () => {
  const { data, error } = await supabase
  .rpc('get_my_folders', {});
  // const { data, error } = await supabase
  //   .from('folders')
  //   .select('id, title, parent')
  //   .eq('userid', userid)
  //   .order('title', { ascending: true });
  return { data, error };
}
export const countLessonsInRoot = async () => {
  const { count, error } = await supabase
  .from('lessons')
  .select('*', { count: 'exact', head: true })
  //.eq('userid', userid)
  .is('folder', null);
  return { count, error };
}

export const updateFolderParent = async (folderid: string, newparentid: string | null) => {
  if (folderid === newparentid) {
    console.error('cannot move folder into itself')
    return;
  }
  const { error } = 
  await supabase.from('folders')
  .update({ parent: newparentid })
  .eq('id', folderid);
  return error;
}
