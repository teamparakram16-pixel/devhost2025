import { supabase } from "@/lib/supabaseClient";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    console.log("🟢 [START] Product creation request received");

    // Parse incoming form data
    const formData = await req.formData();
    console.log("📦 Parsed form data");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const expiration_date = formData.get("expiration_date") as string | null;

    const manufacturing_report = formData.get("manufacturing_report") as File | null;
    const sales_report = formData.get("sales_report") as File | null;
    const image = formData.get("image") as File | null;

    console.log("🧾 Form fields:", {
      name,
      description,
      expiration_date,
      manufacturing_report: !!manufacturing_report,
      sales_report: !!sales_report,
      image: !!image,
    });

    if (!name) {
      console.warn("⚠️ Missing product name");
      return new Response(JSON.stringify({ error: "Product name is required" }), { status: 400 });
    }

    // Get logged-in user
    console.log("🔑 Checking Supabase session...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Supabase session error:", sessionError);
    }

    if (!sessionData.session) {
      console.warn("⚠️ No valid session found");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = sessionData.session.user;
    const userId = user.id;
    console.log("👤 Authenticated user:", userId);

    // Get company linked to this user
    console.log("🏢 Fetching company linked to user...");
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", userId) // confirm this logic is correct
      .single();

    if (companyError) {
      console.error("❌ Error fetching company:", companyError);
    }

    if (!company) {
      console.warn("⚠️ Company not found for user:", userId);
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 400 });
    }

    const company_id = company.id;
    console.log("🏢 Found company:", company_id);

    // Function to upload file and insert metadata
    async function handleMediaUpload(file: File, folder: string) {
      console.log(`⬆️ Starting upload for ${file.name} to folder: ${folder}`);

      const buffer = Buffer.from(await file.arrayBuffer());
      const tempPath = path.join("/tmp", `${randomUUID()}-${file.name}`);

      console.log("📝 Writing temp file:", tempPath);
      await fs.writeFile(tempPath, buffer);

      console.log("☁️ Uploading to Cloudinary...");
      const uploadResult = await uploadToCloudinary(tempPath, {
        folder: `devhack/${folder}`,
        resourceType: "auto",
      });

      console.log("✅ Cloudinary upload result:", uploadResult);

      console.log("🧹 Deleting temp file...");
      await fs.unlink(tempPath);

      if (!uploadResult.success || !uploadResult.publicId || !uploadResult.url) {
        console.error("❌ Cloudinary upload failed for", file.name);
        throw new Error(`Failed to upload ${file.name}: ${uploadResult.error}`);
      }

      console.log("💾 Inserting media metadata into Supabase...");
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .insert([
          {
            url: uploadResult.secureUrl || uploadResult.url,
            public_id: uploadResult.publicId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            width: uploadResult.width,
            height: uploadResult.height,
            duration: uploadResult.duration,
            uploaded_by: userId,
            company_id,
          },
        ])
        .select("id")
        .single();

      if (mediaError) {
        console.error("❌ Supabase insert error (media):", mediaError);
        throw new Error(mediaError.message);
      }

      console.log("✅ Media inserted, ID:", mediaData.id);
      return mediaData.id;
    }

    // Upload any attached files
    let manufacturing_id = null;
    let sales_id = null;
    let image_id = null;

    if (manufacturing_report) {
      console.log("📤 Uploading manufacturing report...");
      manufacturing_id = await handleMediaUpload(manufacturing_report, "manufacturing_reports");
    }

    if (sales_report) {
      console.log("📤 Uploading sales report...");
      sales_id = await handleMediaUpload(sales_report, "sales_reports");
    }

    if (image) {
      console.log("📤 Uploading product image...");
      image_id = await handleMediaUpload(image, "product_images");
    }

    // Insert product record
    console.log("🧾 Creating product entry in Supabase...");
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          expiration_date,
          company_id,
          manufacturing_report: manufacturing_id,
          sales_report: sales_id,
          image: image_id,
        },
      ])
      .select()
      .single();

    if (productError) {
      console.error("❌ Supabase insert error (product):", productError);
      throw new Error(productError.message);
    }

    console.log("✅ Product created successfully with ID:", product.id);

    return new Response(
      JSON.stringify({
        message: "✅ Product created successfully",
        product,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ [CATCH] Error creating product:", error);
    console.error("🪲 Stack trace:", error.stack);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
    });
  } finally {
    console.log("🏁 [END] Product creation attempt complete");
  }
}
