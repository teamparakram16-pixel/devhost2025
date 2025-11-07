import { NextResponse } from "next/server";
import { getProductDetails } from "@/lib/tools/products";
import { searchYoutube, getYoutubeTranscript } from "@/lib/tools/youtube";
import { redditScrape } from "@/lib/tools/reddit";
import { createClient } from "@/lib/supabaseServer";
import { callGemini } from "@/lib/gemini/gemini";
import { YoutubeVideo, CompiledProductData, ApiResponse } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { product_id, message } = payload;

    // 1. Authenticate user
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user_id = data.user?.id;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "User authentication required" },
        { status: 401 }
      );
    }

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 2. Get Product Details (uses lib/tools/products)
    const productData = await getProductDetails(product_id);
    if (!productData.product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 3. Search for related YouTube videos (uses lib/tools/youtube)
    const productName = productData.product.name || "";
    const youtubeResults = await searchYoutube(productName, 3);

    // 4. Get transcripts for the videos (uses lib/tools/youtube)
    const transcripts = await Promise.all(
      youtubeResults.map(async (video: YoutubeVideo) => {
        try {
          const transcript = await getYoutubeTranscript(video.videoId);
          return {
            videoId: video.videoId,
            title: video.title,
            transcript: transcript.text,
          };
        } catch (error) {
          console.error(`Failed to get transcript for video ${video.videoId}:`, error);
          return {
            videoId: video.videoId,
            title: video.title,
            transcript: null,
          };
        }
      })
    );

    // 5. Get Reddit discussions (uses lib/tools/reddit) if product has reddit URLs
    let redditData: Array<{ url: string; content: string | null }> = [];
    if (productData.product.reddit_urls && Array.isArray(productData.product.reddit_urls)) {
      redditData = await Promise.all(
        productData.product.reddit_urls.map(async (url: string) => {
          try {
            const redditContent = await redditScrape(url);
            return {
              url,
              content: redditContent?.scraped_data ?? null,
            };
          } catch (error) {
            console.error(`Failed to scrape Reddit URL ${url}:`, error);
            return { url, content: null };
          }
        })
      );
    }

    // 6. Compile all data to send back to frontend and to include in prompt
    const compiledData = {
      product: productData.product,
      youtube_data: {
        videos: youtubeResults,
        transcripts: transcripts.filter((t) => t.transcript !== null),
      },
      reddit_data: redditData.filter((d) => d.content !== null),
      user_id,
      message,
    };

    // 7. Build sources array (trim excerpts) used for Gemini prompt and for returning to UI
    const sources: Array<any> = [];

    // product as source
    sources.push({
      type: "product",
      id: productData.product.id,
      title: productData.product.name,
      excerpt: (productData.product.description || "").toString().slice(0, 2000),
      url: null,
    });

    // youtube videos + transcripts
    for (const v of youtubeResults) {
      const t = transcripts.find((x: any) => x.videoId === v.videoId);
      sources.push({
        type: "video",
        id: v.videoId,
        title: v.title,
        excerpt: (t?.transcript || "").toString().slice(0, 4000),
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
      });
    }

    // reddit
    for (const r of redditData) {
      sources.push({
        type: "reddit",
        id: r.url,
        title: r.url,
        excerpt: (r.content || "").toString().slice(0, 4000),
        url: r.url,
      });
    }

    // 8. Call Gemini to analyze demand + predict price AND generate a business roadmap
    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    let geminiResult: any = null;
    let geminiRaw: any = null;

    if (!apiKey) {
      console.warn("No Gemini API key found in environment; skipping AI call.");
    } else {
      const promptObj = {
        task: "analyze_demand_predict_price_and_generate_roadmap",
        product: {
          id: productData.product.id,
          name: productData.product.name,
          price: productData.product.price ?? null,
          metadata: {
            category: productData.product.category ?? null,
            tags: productData.product.tags ?? null,
          },
        },
        sources, // trimmed sources array (product, videos, reddit)
        context:
          "Use the provided sources to assess current demand signals, pricing comparables, seasonal trends and community sentiment. Produce a concise, actionable business roadmap tailored for POS/ERP owners (product listings, pricing, promotion, inventory & channel recommendations).",
        instructions: {
          output_schema: {
            demand_level: "one of ['low','medium','high']",
            predicted_price:
              "number (predicted price in same currency as product.price or absolute if not available)",
            reasoning: "string (brief explanation of main factors, max 150 words)",
            used_sources: "array of source ids used in the analysis",
            demand_path:
              "array of steps; each step is { title: string, description: string, timeframe: string, estimated_impact: 'low'|'medium'|'high', confidence: 'low'|'medium'|'high' }",
            recommended_actions:
              "array of short actionable items for merchandising/marketing/inventory/pricing (strings)",
            seasonal_notes:
              "optional string describing seasonality or timing suggestions (max 80 words)",
          },
          notes:
            "Return JSON only. Do not include any explanatory text outside the JSON. Keep fields concise. Use source ids from the 'sources' array for used_sources. Timeframes should be short phrases like '1 month', 'Quarter', '6 months', 'Seasonal'.",
        },
      };

      const prompt = `You are a retail/ERP strategist. Given the following JSON input, analyze demand, predict a reasonable SKU price, and generate a concise business roadmap (demand path) tailored to POS/ERP and product listing owners. Return a single JSON object (no markdown, no text) that exactly matches the schema described in "instructions.output_schema". Input:\n${JSON.stringify(
        promptObj,
        null,
        2
      )}`;

      try {
        // callGemini in lib/gemini/gemini.ts returns parsed JSON when possible
        geminiRaw = await callGemini(prompt, apiKey);
        geminiResult = geminiRaw;
      } catch (err: any) {
        console.error("Gemini call failed:", err?.message ?? err);
        geminiResult = null;
      }
    }

    // 9. Normalize / defensive parsing of Gemini output so frontend can read fields reliably
    let aiNormalized: any = null;
    if (geminiResult) {
      try {
        // geminiResult may already be an object
        const parsed = typeof geminiResult === "string" ? JSON.parse(geminiResult) : geminiResult;
        aiNormalized = {
          demand_level:
            parsed.demand_level ?? parsed.demandLevel ?? parsed.demand ?? null,
          predicted_price:
            parsed.predicted_price ?? parsed.predictedPrice ?? parsed.price ?? null,
          reasoning: parsed.reasoning ?? parsed.explanation ?? parsed.rationale ?? null,
          used_sources:
            Array.isArray(parsed.used_sources)
              ? parsed.used_sources
              : Array.isArray(parsed.usedSources)
              ? parsed.usedSources
              : Array.isArray(parsed.used)
              ? parsed.used
              : [],
          raw: geminiRaw,
        };
      } catch (e) {
        console.warn("Failed to parse Gemini result into JSON, returning raw:", e);
        aiNormalized = { raw: geminiRaw };
      }
    }

    // 10. Build response shaped for frontend (products page & quiz view)
    const response: ApiResponse<any> = {
      success: true,
      data: {
        analysis: compiledData,
        ai: aiNormalized,
        sources, // include the trimmed sources for UI listing
      },
    };

    // Console helpful debugging output for frontend dev console
    console.log("analyze-product response:", {
      product_id,
      compiledDataSummary: {
        product: compiledData.product?.id ?? null,
        videos: compiledData.youtube_data?.videos?.length ?? 0,
        reddit_hits: compiledData.reddit_data?.length ?? 0,
      },
      ai: aiNormalized,
      sourcesCount: sources.length,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in product analysis route:", error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error.message || "An error occurred while processing your request",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}