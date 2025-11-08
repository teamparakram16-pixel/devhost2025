import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ListToolsResultSchema,
  CallToolResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

export class GeminiMCPClient {
  private gemini: GoogleGenerativeAI;
  private mcpClient: Client;
  private model: any;

  constructor() {
    this.gemini = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    this.model = this.gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are  AI Assistant for l Demand Forecasting & Dynamic Pricing. Follow this strict orchestration when a user asks about product evaluation or pricing:
1) If a tool call is required, ALWAYS call tools first. Do not synthesize final answers without using tools.
2) First tool call MUST be: fetch_product_details { "product_id": "<id>" } to fetch canonical product metadata.
3) After product details are returned, generate two focused search queries:
   - reddit_query: "reddit <product_title> <model_or_key_attribute> reviews discussion"
   - youtube_query: "<product_title> review OR unboxing OR hands-on"
4) Use youtube_search and google_search with those queries to get candidate hits (lightweight metadata only).
5) Call summarize_search_hits with the search results to select the most relevant hits.
6) Call expand_selected_sources only for the selected hits to fetch detailed data (YouTube transcripts, Reddit excerpts, page excerpts).
7) After expand_selected_sources returns, synthesize market signals, comparable prices, and produce a final JSON response matching the agreed schema:
{
  "product_id": string,
  "product": object,
  "sources": { "youtube": [...], "reddit": [...], "other_links": [...] },
  "market_summary": { "demand": "low|medium|high", "sentiment_summary": string, "comparable_prices": [...] },
  "recommended_price": { "price": number, "currency": string, "confidence": "low|medium|high" },
  "rationale": string
}
8) Be explicit about each tool call (name and exact JSON arguments) and wait for the tool result before planning the next step.
Always follow tool input/output schemas and avoid fetching or summarizing details until the appropriate expand_selected_sources tool is called.`,
    });

    this.mcpClient = new Client(
      {
        name: "gemini-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    const isProd = process.env.NEXT_PUBLIC_NODE_ENV === "production";

    const transport = new StdioClientTransport({
      command: isProd ? "node" : "tsx",
      args: [isProd ? "dist/server/mcp-server.js" : "server/mcp-server.ts"],
    });

    await this.mcpClient.connect(transport);
    console.log("✅ Connected to MCP Server");
  }

  async chat(
    message: string,
    context?: { userId?: string; productId?: string; product?: any }
  ) {
    try {
      // Get available tools from MCP
      const responseData = await this.mcpClient.request(
        { method: "tools/list" },
        ListToolsResultSchema
      );

      const tools = (responseData as any).tools || [];

      console.log("🛠️ Available tools:", JSON.stringify(tools, null, 2));

      // Convert MCP tools to Gemini function declarations
      const functionDeclarations = tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      }));

      console.log("Context : ", context);

      // Build initial history: include userId and selected productId (if provided)
      const history: any[] = [];
      if (context?.userId) {
        console.log("User ID:", context.userId);
        history.push({
          role: "user",
          parts: [{ text: `My user ID is: ${context.userId}` }],
        });
      }

      if (context?.productId) {
        console.log("Selected productId:", context.productId);
        history.push({
          role: "user",
          parts: [
            {
              text: `Selected product_id: "${context.productId}". When you need product metadata, CALL the tool "fetch_product_details" as the FIRST tool call with { "product_id": "${context.productId}" }. After that you may generate search queries and call the other tools.`,
            },
          ],
        });
      }

      // Start chat with function calling enabled; let Gemini decide if/when to call tools
      const chat = this.model.startChat({
        functions: functionDeclarations,
        history,
      });

      // placeholder for the initial send result
      let result: any = null;

      // If route provided full product record, inject it into the chat so the model receives canonical product metadata first.
      // We inject as a functionResponse named "fetch_product_details" (the model expects that tool output format).
      if (context?.product) {
        console.log("Product context provided:", context.product.id ?? "(no id)");
        const forcedPayload = JSON.stringify(context.product, null, 2);
        const functionResponseMessage = {
          functionResponse: {
            name: "fetch_product_details",
            response: { content: forcedPayload },
          },
        };
        console.log(
          "⚙️ Injecting product into chat (provided by route):",
          context.product.id ?? "(no id)"
        );
        // send the functionResponse as its own message (SDK requires it not be mixed)
        await chat.sendMessage([functionResponseMessage]);
        // then send the user's message so the model sees product data + user query in order
        result = await chat.sendMessage(message);
      } else {
        // no inline product provided — just send user's message (the model may call tools itself)
        result = await chat.sendMessage(message);
      }

      // result is set by the sends above; if not, send user's message now
      if (!result) {
        result = await chat.sendMessage(message);
      }
      console.log(
        "💬 Gemini initial response (full):",
        JSON.stringify(result.response?.toJSON?.() ?? result.response, null, 2)
      );

      let response = result.response;

      // Robust normalizer to extract function-calls from multiple SDK shapes.
      // const getFunctionCalls = (resp: any) => {
      //   try {
      //     if (!resp) return [];

      //     // 1) methods that return calls
      //     if (typeof resp.functionCalls === "function") {
      //       const out = resp.functionCalls();
      //       if (Array.isArray(out) && out.length) return out;
      //     }
      //     if (typeof resp.functionCall === "function") {
      //       const single = resp.functionCall();
      //       if (single) return [single];
      //     }

      //     // 2) snake_case variants
      //     if (typeof resp.function_calls === "function") {
      //       const out = resp.function_calls();
      //       if (Array.isArray(out) && out.length) return out;
      //     }
      //     if (typeof resp.function_call === "function") {
      //       const single = resp.function_call();
      //       if (single) return [single];
      //     }

      //     // 3) direct properties
      //     if (Array.isArray(resp.functionCalls) && resp.functionCalls.length)
      //       return resp.functionCalls;
      //     if (resp.functionCall) return [resp.functionCall];
      //     if (Array.isArray(resp.function_calls) && resp.function_calls.length)
      //       return resp.function_calls;
      //     if (resp.function_call) return [resp.function_call];

      //     // 4) inspect candidates (some SDKs put function call on the chosen candidate)
      //     if (Array.isArray(resp.candidates) && resp.candidates.length) {
      //       const extracted = resp.candidates
      //         .map(
      //           (c: any) =>
      //             c.function_call ??
      //             c.message?.function_call ??
      //             c.message?.functionCall ??
      //             c.functionCall
      //         )
      //         .filter(Boolean);
      //       if (extracted.length) return extracted;
      //     }

      //     // 5) try top-level message variants
      //     if (resp.message?.function_call) return [resp.message.function_call];

      //     return [];
      //   } catch (err) {
      //     console.warn("getFunctionCalls error:", err);
      //     return [];
      //   }
      // };

      const getFunctionCalls = (resp: any) => {
        try {
          console.log("getFunctionCalls input:", resp);
          if (!resp) return [];

          console.log("Trying to extract function calls...");

          // ✅ Try new SDK API first
          if (typeof resp.functionCalls === "function") {
            const fc = resp.functionCalls();
            return Array.isArray(fc) ? fc : [];
          }

          // ✅ Fallbacks for old SDKs or candidate-based responses
          if (Array.isArray(resp.functionCalls)) return resp.functionCalls;
          if (resp.functionCall) return [resp.functionCall];
          if (Array.isArray(resp.candidates)) {
            const extracted = resp.candidates
              .map((c: any) => c.functionCall || c.message?.functionCall)
              .filter(Boolean);
            return extracted;
          }

          return [];
        } catch (err) {
          console.warn("getFunctionCalls error:", err);
          return [];
        }
      };

      // debug log shape
      console.log("🧭 response keys:", Object.keys(response || {}));
      if (typeof response?.functionCalls === "function")
        console.log("response.functionCalls is a function");
      if (typeof response?.functionCall === "function")
        console.log("response.functionCall is a function");
      if (response?.candidates)
        console.log("response.candidates length:", response.candidates.length);

      const MAX_TOOL_CALLS = 20;
      let callCount = 0;
      const executedTools = new Set<string>();

      // Loop while the model requests tool calls. Each iteration: execute the tool and send the result back.
      let functionCalls = getFunctionCalls(response);

      console.log(
        "Initial function calls:",
        JSON.stringify(functionCalls, null, 2)
      );
      while (functionCalls && functionCalls.length > 0) {
        console.log(
          "🔄 Processing tool call request...",
          JSON.stringify(functionCalls, null, 2)
        );
        if (++callCount > MAX_TOOL_CALLS) {
          throw new Error("Exceeded max tool call iterations");
        }

        const functionCall = functionCalls[0];
        console.log(
          `🔧 Tool requested: ${functionCall.name}`,
          functionCall.args
        );

        // Enforce "first call must be fetch_product_details" when productId was provided
        if (
          executedTools.size === 0 &&
          context?.productId &&
          functionCall.name !== "fetch_product_details"
        ) {
          // remind model to call fetch_product_details first with the selected id
          result = await chat.sendMessage([
            {
              role: "assistant",
              parts: [
                {
                  text: `Please call the tool "fetch_product_details" first with { "product_id": "${context.productId}" } before performing searches.`,
                },
              ],
            },
          ]);
          response = result.response;
          continue;
        }

        // parse arguments (tool may send JSON as string)
        let callArgs: any = functionCall.args;
        if (typeof callArgs === "string" && callArgs.trim()) {
          try {
            callArgs = JSON.parse(callArgs);
          } catch {
            // leave as string if not valid JSON
          }
        }

        // Execute the tool via MCP
        const toolResult = await this.mcpClient.request(
          {
            method: "tools/call",
            params: {
              name: functionCall.name,
              arguments: callArgs,
            },
          },
          CallToolResultSchema
        );

        executedTools.add(functionCall.name);

        // Create a stable text representation of the tool result to return to Gemini
        let toolText = "";
        try {
          if (
            Array.isArray(toolResult.content) &&
            toolResult.content.length > 0
          ) {
            toolText = toolResult.content
              .map((c: any) =>
                typeof c.text === "string" ? c.text : JSON.stringify(c)
              )
              .join("\n");
          } else {
            toolText = JSON.stringify(toolResult);
          }
        } catch {
          toolText = String(toolResult);
        }

        // Send the tool response back to Gemini as a functionResponse message
        result = await chat.sendMessage([
          {
            functionResponse: {
              name: functionCall.name,
              response: {
                content: toolText,
              },
            },
          },
        ]);

        response = result.response;
        // recompute functionCalls after model receives the tool response
        functionCalls = getFunctionCalls(response);
      }

      // No more tool calls — return final text (could be the JSON schema)
      return response.text();
    } catch (error) {
      console.error("❌ Gemini chat error:", error);
      throw error;
    }
  }

  async disconnect() {
    await this.mcpClient.close();
  }
}
