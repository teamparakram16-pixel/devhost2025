import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password, company_name } = await req.json();

    // Step 1: Create Auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return new Response(JSON.stringify({ error: signUpError.message }), { status: 400 });
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User creation failed" }), { status: 400 });
    }

    // Step 2: Insert into companies table
    const { error: companyError } = await supabase
      .from("companies")
      .insert({
        id: userId,
        company_name,
        email,
      });

    if (companyError) {
      return new Response(JSON.stringify({ error: companyError.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({ message: "Company registered successfully", user: signUpData.user }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
