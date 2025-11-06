import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class GeminiMCPClient {
  private gemini: GoogleGenerativeAI;
  private mcpClient: Client;
  private model: any;

  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.gemini.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: `You are SahyadriPrep AI Assistant. You help students prepare for interviews by:
      1. Analyzing their profiles and suggesting personalized preparation plans
      2. Searching interview experiences from our database
      3. Providing company-specific insights
      4. Identifying preparation gaps

      You have access to tools via MCP server to query our database. Always use tools when you need data.`,
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

  async chat(message: string, context?: { userId?: string }) {
    try {
      // Get available tools from MCP
      const { tools } = await this.mcpClient.request<{ tools: any[] }>(
        { method: "tools/list" },
        {}
      );

      // Convert MCP tools to Gemini function declarations
      const functionDeclarations = tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      }));

      // Start chat with function calling
      const chat = this.model.startChat({
        tools: [{ functionDeclarations }],
        history: context?.userId
          ? [
              {
                role: "user",
                parts: [{ text: `My user ID is: ${context.userId}` }],
              },
            ]
          : [],
      });

      let result = await chat.sendMessage(message);
      let response = result.response;

      // Handle function calls
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];

        console.log(`🔧 Calling tool: ${functionCall.name}`);

        // Execute function via MCP
        const toolResult = await this.mcpClient.request(
          {
            method: "tools/call",
            params: {
              name: functionCall.name,
              arguments: functionCall.args,
            },
          },
          {}
        );

        // Send function result back to Gemini
        result = await chat.sendMessage([
          {
            functionResponse: {
              name: functionCall.name,
              response: {
                content: toolResult.content[0].text,
              },
            },
          },
        ]);

        response = result.response;
      }

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
