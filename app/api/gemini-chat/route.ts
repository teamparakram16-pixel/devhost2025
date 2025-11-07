import { NextResponse } from "next/server";
import { GeminiMCPClient } from "@/lib/gemini/client";
import { createClient } from "@/lib/supabaseServer";

let singletonClient: GeminiMCPClient | null = null;
let connectPromise: Promise<void> | null = null;

async function getClient() {
  if (!singletonClient) {
    singletonClient = new GeminiMCPClient();
  }
  if (!connectPromise) {
    connectPromise = singletonClient.connect();
  }
  await connectPromise;
  return singletonClient;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const message: string = payload.message || payload.prompt || "";
    const product_id: string | undefined = payload.product_id || "";

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user_id = data.user?.id;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "user_id is required" },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { success: false, error: "message is required" },
        { status: 400 }
      );
    }

    console.log(
      `gemini-chat route: user_id=${user_id} product_id=${product_id} message=${message.substring(
        0,
        50
      )}...`
    );

    // Attempt chat, retry once if MCP connection was closed
    let client = await getClient();
    try {
      // Fetch product details from Supabase here and pass them into the chat context
      let productRecord: any = null;
      if (product_id) {
        try {
          const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", product_id)
            .single();
          if (error) {
            console.warn(
              "Failed to fetch product from supabase:",
              error.message ?? error
            );
          } else {
            productRecord = product;
          }
        } catch (fetchErr) {
          console.warn("Error fetching product:", fetchErr);
        }
      }

      console.log("Product record fetched:", productRecord);

      const resultText = await client.chat(message, {
        userId: user_id,
        productId: product_id,
        product: productRecord, // send full product object (or null) to MCP/Gemini client
      });
      return NextResponse.json({ success: true, text: resultText });
    } catch (err: any) {
      console.warn(
        "First attempt to call Gemini/chat failed:",
        err?.message ?? err
      );

      const errMsg = String(err?.message ?? err).toLowerCase();
      const isMcpConnectionClosed =
        errMsg.includes("connection closed") ||
        errMsg.includes("mcp error") ||
        errMsg.includes("-32000");

      if (!isMcpConnectionClosed) {
        // Non-MCP error: surface it to client
        throw err;
      }

      // Reset client and retry once
      console.warn(
        "MCP connection closed detected — reconnecting and retrying once"
      );
      singletonClient = null;
      connectPromise = null;

      try {
        client = await getClient();
        const retryText = await client.chat(message, {
          userId: user_id,
          productId: product_id,
        });
        return NextResponse.json({ success: true, text: retryText });
      } catch (retryErr: any) {
        console.error("Retry after MCP reconnect failed:", retryErr);
        return NextResponse.json(
          {
            success: false,
            error: `MCP error -32000: Connection closed (retry failed): ${
              retryErr?.message ?? String(retryErr)
            }`,
          },
          { status: 500 }
        );
      }
    }
  } catch (err: any) {
    console.error("gemini-chat route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
