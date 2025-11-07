import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: userData, error: sessionError } =
      await supabase.auth.getUser();

    if (sessionError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = userData.user;
    const userId = user.id;

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", userId)
      .single();

    if (companyError || !company) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
      });
    }

    const company_id = company.id;

    // ✅ 3️⃣ Fetch all products belonging to this company
    // Join with media table to get URLs of linked files
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        expiration_date,
        created_at,
        updated_at,
        company_id,
        image:image (id, url, file_name),
        manufacturing_report: manufacturing_report (id, url, file_name),
        sales_report:sales_report (id, url, file_name)
      `
      )
      .eq("company_id", company_id)
      .order("created_at", { ascending: false });

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        message: "✅ Products fetched successfully",
        count: products?.length || 0,
        products,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      {
        status: 500,
      }
    );
  }
}
