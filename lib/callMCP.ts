export async function callMCP(toolName: string, args: Record<string, any>): Promise<string> {
  try {
    const response = await fetch("http://localhost:4000/call-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "callTool",
        params: { name: toolName, arguments: args },
        id: 1,
      }),
    })

    const data = await response.json()
    return data?.result?.content?.[0]?.text || ""
  } catch (err) {
    console.error(`MCP Error [${toolName}]:`, err)
    return ""
  }
}
