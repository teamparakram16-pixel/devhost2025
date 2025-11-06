export async function GET() {
  // After Google login, Supabase automatically handles session creation.
  return new Response("✅ Google login successful! You can close this tab now.");
}
