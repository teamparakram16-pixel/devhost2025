// import { NextRequest, NextResponse } from "next/server"
// import { supabase } from "@/lib/supabaseClient"
// import { callGemini } from "@/lib/callGemini"
// import { callMCP } from "@/lib/callMCP"

// // 🧩 Type definitions
// interface Product {
//   id: string
//   name: string
//   description: string | null
// }

// interface ProductThread {
//   id: string
//   product_id: string
//   ai_questions: string[]
//   user_answers: string[]
//   status: "pending" | "in_progress" | "completed"
//   ai_generated_path?: string
//   sources?: { source: string; url: string }[]
// }

// // 🧠 Helper: standardized JSON response
// function jsonResponse(data: any, status = 200) {
//   return NextResponse.json(data, { status })
// }

// // ⚙️ API Route: Create or continue Demand Path thread
// export async function POST(req: NextRequest) {
//   try {
//     const { product_id, user_answer }: { product_id: string; user_answer?: string } = await req.json()

//     if (!product_id) {
//       return jsonResponse({ error: "Missing product_id" }, 400)
//     }

//     // 1️⃣ Try to find an existing in-progress thread
//     const { data: thread, error: threadErr } = await supabase
//       .from("product_threads")
//       .select("*")
//       .eq("product_id", product_id)
//       .eq("status", "in_progress")
//       .maybeSingle()

//     if (threadErr) throw threadErr

//     // 2️⃣ If no thread → create a new one
//     if (!thread) {
//       const { data: product, error: productErr } = await supabase
//         .from("products")
//         .select("name, description")
//         .eq("id", product_id)
//         .single()

//       if (productErr || !product) {
//         return jsonResponse({ error: "Product not found" }, 404)
//       }

//       const query = product.name

//       // 🧠 Fetch Reddit + YouTube data concurrently
//       const [redditData, youtubeData] = await Promise.allSettled([
//         callMCP("reddiy_scrape", {
//           reddit_url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
//         }),
//         callMCP("youtube_search", { query, maxResults: 3 }),
//       ])

//       const redditText =
//         redditData.status === "fulfilled" ? redditData.value.slice(0, 1000) : "No Reddit data."
//       const youtubeText =
//         youtubeData.status === "fulfilled" ? youtubeData.value.slice(0, 1000) : "No YouTube data."

//       // 🧠 Gemini prompt to generate AI questions
//       const prompt = `
// You're an AI helping retailers understand product demand trends.
// Analyze the following insights and generate 3–5 questions that help uncover user demand for this product.

// Product: ${product.name}
// Description: ${product.description || "N/A"}

// Reddit discussions:
// ${redditText}

// YouTube content:
// ${youtubeText}

// Return a JSON response like:
// {"questions": ["question1", "question2", "question3", ...]}
// `
//       const geminiResponse = await callGemini(prompt)
//       let questions: string[] = []

//       try {
//         questions = JSON.parse(geminiResponse).questions || []
//       } catch {
//         questions = geminiResponse
//           .split("\n")
//           .map((l: string) => l.trim())
//           .filter((l: string) => l.length > 0)
//           .slice(0, 5)
//       }

//       if (!questions.length) {
//         throw new Error("Gemini failed to generate questions")
//       }

//       // 🗂️ Create new thread
//       const { data: newThread, error: insertErr } = await supabase
//         .from("product_threads")
//         .insert({
//           product_id,
//           ai_questions: questions,
//           status: "in_progress",
//           sources: [
//             { source: "reddit", url: `https://reddit.com/search?q=${encodeURIComponent(query)}` },
//             { source: "youtube", url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}` },
//           ],
//         })
//         .select()
//         .single()

//       if (insertErr) throw insertErr

//       return jsonResponse({
//         message: "🧠 New thread created",
//         next_question: questions[0],
//         remaining: questions.length - 1,
//         thread: newThread,
//       })
//     }

//     // 3️⃣ Continue existing thread
//     const questions = thread.ai_questions
//     const answers = thread.user_answers || []

//     // Add the new user answer
//     if (user_answer) answers.push(user_answer)

//     // 4️⃣ Still questions left → continue
//     if (answers.length < questions.length) {
//       const nextQuestion = questions[answers.length]
//       await supabase
//         .from("product_threads")
//         .update({ user_answers: answers })
//         .eq("id", thread.id)

//       return jsonResponse({
//         message: "✅ Answer saved",
//         next_question: nextQuestion,
//         remaining: questions.length - answers.length,
//       })
//     }

//     // 5️⃣ All questions answered → generate final demand path
//     const finalPrompt = `
// You are an AI retail strategist.
// Based on these Q&A responses, summarize a clear 3-step "Demand Path" to help the retailer act on customer demand.

// Questions: ${JSON.stringify(questions)}
// Answers: ${JSON.stringify(answers)}

// Each step should be short and actionable.
// Return plain text only.
// `
//     const demandPath = await callGemini(finalPrompt)

//     await supabase
//       .from("product_threads")
//       .update({
//         user_answers: answers,
//         ai_generated_path: demandPath,
//         status: "completed",
//       })
//       .eq("id", thread.id)

//     return jsonResponse({
//       message: "✅ Demand Path generated successfully",
//       demand_path: demandPath,
//       sources: thread.sources,
//     })
//   } catch (err: any) {
//     console.error("❌ Error in /analyze-demand:", err)
//     return jsonResponse({ error: err.message || "Server error occurred" }, 500)
//   }
// }
