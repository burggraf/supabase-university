import { supabase } from '$services/supabase.service';

export const signUpWithEmail = async (email: string, password: string) => {
    // first try logging in... sometimes the user already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (signInData.user) {
      return { user: signInData.user, session: signInData.session, error: signInError };
    } 
    // this still doesn't cover if they already exist but entered the wrong password

    // if the user doesn't exist, create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin // .origin
      }
    });
    return { user: data.user, session: data.session, error };
  }
  
  export const sendMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { user: data.user, session: data.session, error };
  }
  
  export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { user: data.user, session: data.session, error };
  }

  export const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin // + '/resetpassword'
      });
    return { data, error };
  }
  