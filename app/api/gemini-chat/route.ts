import { NextResponse } from "next/server";
import { GeminiMCPClient } from "@/lib/gemini/client";

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
    const user_id: string | undefined = payload.userId || payload.user_id;
    const product_id: string | undefined =
      payload.productId || payload.product_id;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "message is required" },
        { status: 400 }
      );
    }

    const client = await getClient();

    // run the chat/orchestration. context currently supports userId.
    const resultText = await client.chat(message, {
      userId: user_id,
      productId: product_id,
    });

    return NextResponse.json({ success: true, text: resultText });
  } catch (err: any) {
    console.error("gemini-chat route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
