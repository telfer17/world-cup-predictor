import { createClient } from "@supabase/supabase-js";

// Browser-safe client using the publishable key (anon-level access only).
// Intended for future public reads; predictions writes must go through
// the server route, since RLS blocks anon writes.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
