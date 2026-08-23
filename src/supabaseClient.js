import { createClient } from "@supabase/supabase-js";

// Frontend Supabase client - uses the public anon/publishable key only.
// This is safe to expose in the browser (unlike the service_role key the
// backend uses); Row Level Security is the real boundary for anything
// queried directly through this client, though this app mostly uses it
// just for auth (login/session), routing everything else through Express.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
