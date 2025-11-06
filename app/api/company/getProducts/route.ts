import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = sessionData.session.user;
    const userId = user.id;

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", userId)
      .single();

    if (companyError || !company) {
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 });
    }

    const company_id = company.id;

    // ✅ 3️⃣ Fetch all products belonging to this company
    // Join with media table to get URLs of linked files
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        expiration_date,
        created_at,
        updated_at,
        company_id,
        image:media!products_image_fkey (id, url, file_name),
        manufacturing_report:media!products_manufacturing_report_fkey (id, url, file_name),
        sales_report:media!products_sales_report_fkey (id, url, file_name)
      `)
      .eq("company_id", company_id)
      .order("created_at", { ascending: false });

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), { status: 500 });
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
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
    });
  }
}
