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
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
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
    const transport = new StdioClientTransport({
      command: "node",
      args: ["dist/lib/mcp/server.js"], // Build MCP server first
    });

    await this.mcpClient.connect(transport);
    console.log("✅ Connected to MCP Server");
  }

  async chat(
    message: string,
    context?: { userId?: string; productId?: string }
  ) {
    try {
      // Get available tools from MCP
      const { tools } = await this.mcpClient.request(
        { method: "tools/list" },
        ListToolsResultSchema
      );

      // Convert MCP tools to Gemini function declarations
      const functionDeclarations = tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      }));

      // Build initial history: include userId and selected productId (if provided)
      const history: any[] = [];
      if (context?.userId) {
        history.push({
          role: "user",
          parts: [{ text: `My user ID is: ${context.userId}` }],
        });
      }

      if (context?.productId) {
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
        tools: functionDeclarations,
        history,
      });

      // send user's initial message
      let result = await chat.sendMessage(message);
      let response = result.response;

      const MAX_TOOL_CALLS = 20;
      let callCount = 0;
      const executedTools = new Set<string>();

      // Loop while the model requests tool calls. Each iteration: execute the tool and send the result back.
      while (response.functionCalls && response.functionCalls.length > 0) {
        if (++callCount > MAX_TOOL_CALLS) {
          throw new Error("Exceeded max tool call iterations");
        }

        const functionCall = response.functionCalls[0];
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
