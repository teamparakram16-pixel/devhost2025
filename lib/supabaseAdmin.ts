import { createClient } from "@supabase/supabase-js"; // ✅ Admin client

/**
 * ⚠️ ADMIN CLIENT - Full database access
 * Only use for admin operations (delete users, bypass RLS, etc.)
 * NEVER expose to client
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY; // ✅ Service role key

  console.log("Supabase Admin URL:", supabaseUrl ? "✅ Present" : "❌ Missing");
  console.log(
    "Supabase Service Key:",
    supabaseServiceKey ? "✅ Present" : "❌ Missing"
  );

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin credentials");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}
