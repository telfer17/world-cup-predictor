import { createClient } from "@supabase/supabase-js";

// Server-only privileged client using the secret key. Bypasses RLS —
// never import this from client components.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);
