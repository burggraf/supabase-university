// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { multiParser, FormFile } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'

const headers = {
  "Content-Type": "application/json",
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')!
        }
      }
    }
  )
  const parsed = await multiParser(req)
  const {
    data: {
      user
    },
  } = await supabase.auth.getUser()
  if (!user && parsed.fields.to !== 'support@supau.org') {
    return new Response(
      JSON.stringify({
        data: null,
        error: 'User not found'
      }), {
      headers,
      status: 200
    },
    )
  }
  let result: any = null;
  let error: any = null;
  const MAILGUN_KEY = Deno.env.get('MAILGUN_KEY');
  const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN');
  try {
    const f: FormFile = parsed?.files?.files as FormFile;
    // Send your message off to Mailgun!
    const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    const form = new FormData();
    // form.append('from', `${user.email}`);
    form.append('from', `${user?.email || parsed?.fields?.from} <support@supau.org>`);
    // form.append('from', `<${user.email}>support@supau.org`);
    form.append('h:Reply-To', user?.email || parsed?.fields?.from)
    form.append('to', parsed.fields.to);
    if (parsed?.fields?.to === 'support@supau.org') { 
      form.append('subject', `SUPPORT MESSAGE: ${parsed.fields.subject}`);
    } else {
      form.append('subject', `From ${user?.email}: ${parsed.fields.subject}`);
    }
    form.append('html', parsed.fields.html);
    form.append('text', parsed.fields.content);
    if (f?.content!) {
      form.append('attachment', new Blob([f.content!.buffer]), f.filename)
    }
    result = await fetch(url, {
      method: 'POST',
      headers: {
        "Authorization": `Basic ${btoa('api:' + MAILGUN_KEY)}`
      },
      body: form
    });  
  } catch (err) {
    error = err;
  }

    return new Response(
      JSON.stringify({
        "data": {"ok": result?.ok, "redirected": result?.redirected, "status": result?.status, "statusText": result?.statusText},
        "error": error
      }), {
      headers,
      status: 200
    })


})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
