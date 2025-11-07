import { createClient } from "@/lib/supabaseServer";

export async function getProductDetails(productId: string) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { product_id: productId, product };
}