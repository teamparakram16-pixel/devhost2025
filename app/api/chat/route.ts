// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabaseServer";
// import { callGemini } from "@/lib/callGemini";

// export async function POST(req: Request) {
//   try {
//     const { product_id, user_answer }: { product_id: string; user_answer: string } = await req.json();

//     if (!product_id || !user_answer)
//       return NextResponse.json({ error: "Missing product_id or user_answer" }, { status: 400 });

//     const supabase = await createClient();

//     // 1️⃣ Fetch the existing chat thread for this product
//     const { data: thread } = await supabase
//       .from("product_threads")
//       .select("id, ai_questions, user_answers, status")
//       .eq("product_id", product_id)
//       .single();

//     // Initialize if not exists
//     const ai_questions = thread?.ai_questions || [];
//     const user_answers = [...(thread?.user_answers || []), user_answer];

//     // 2️⃣ Ask Gemini for the next question
//     const prompt = `
// You are an AI assistant helping a seller describe their product for demand prediction.
// You have asked the following questions so far:
// ${JSON.stringify(ai_questions)}
// The user has answered:
// ${JSON.stringify(user_answers)}

// If you need more info, ask the *next question only*.
// If enough info is collected, reply exactly with "COMPLETE" (no extra words).
// `;

//     const aiResponse = await callGemini(prompt);
//     const trimmedResponse = aiResponse.trim();

//     // 3️⃣ Check if AI is done
//     const isComplete = trimmedResponse.toUpperCase() === "COMPLETE";

//     // 4️⃣ Update Supabase
//     const { data: updatedThread, error } = await supabase
//       .from("product_threads")
//       .update({
//         ai_questions: isComplete ? ai_questions : [...ai_questions, trimmedResponse],
//         user_answers,
//         status: isComplete ? "ready_for_analysis" : "in_progress",
//         updated_at: new Date().toISOString(),
//       })
//       .eq("product_id", product_id)
//       .select()
//       .single();

//     if (error) throw error;

//     // 5️⃣ Respond
//     return NextResponse.json({
//       success: true,
//       done: isComplete,
//       next_question: isComplete ? null : trimmedResponse,
//       message: isComplete
//         ? "All questions answered. Ready for demand analysis."
//         : "Next question generated.",
//       thread: updatedThread,
//     });
//   } catch (err: any) {
//     console.error("❌ Error in /api/chat:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
