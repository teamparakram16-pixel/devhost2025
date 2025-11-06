import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ user: data.user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
