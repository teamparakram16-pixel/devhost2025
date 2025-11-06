import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/api/auth/callback",
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  // Redirect user to Google's OAuth login page
  return Response.redirect(data.url);
}
