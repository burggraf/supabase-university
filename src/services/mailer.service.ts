
import { supabase } from '$services/supabase.service';
export const mailer = async (message: any) => {

    const { data, error } = await supabase.functions.invoke('mailer', {
      //body: { message }
      body: message
    });
    return { data, error }
  }
  
export const sendmail = async (message: any) => {
  let files: any = [];
  const formData = new FormData();
  formData.set('to', message.to);
  if (message.from) {
    formData.set('from', message.from);
  }
  formData.set('subject', message.subject);
  formData.set('content', message.content);
  formData.set('html', message.html);
  // formData.set('files', files[0], files[0].name);
  if (message.file) {
    formData.set('files', message.file.data, message.file.title);
  }
  
  const { data, error } = await mailer(formData);
  return { data, error };
  // if (error) {
  //     console.log('mailer error', error);
  // } else {
  //     if (data.ok === true) {
  //         console.log('mailer success', data);
  //     } else {
  //         console.log('mailer failure', data);
  //     }
  // }
  // console.log('data', data);
  // console.log('error', error);
}