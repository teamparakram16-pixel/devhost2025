import { fetchYouTubeTranscript } from "@/helpers/youtube-video.helpers";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for MCP
);

// Initialize MCP Server
const server = new Server(
  {
    name: "devhost-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// ✅ TOOL 1: Get Student Profile
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "fetch_youtube_transcript",
        description: "Fetch YouTube video transcript (English) by video ID",
        inputSchema: {
          type: "object",
          properties: {
            video_id: {
              type: "string",
              description: "YouTube video ID",
            },
          },
          required: ["video_id"],
        },
      },
    ],
  };
});

// ✅ TOOL EXECUTION HANDLER
server.setRequestHandler(CallToolRequestSchema, async (request, _extra) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "fetch_youtube_transcript": {
        const { video_id } = args as { video_id: string };
        if (!video_id) {
          throw new Error("video_id is required");
        }

        const transcript = await fetchYouTubeTranscript(video_id);

        if (!transcript) {
          return {
            content: [
              {
                type: "text",
                text: `Transcript not available for video ${video_id}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  video_id,
                  duration: transcript.duration,
                  language: transcript.language,
                  text: transcript.text,
                  segments: transcript.segments,
                },
                null,
                2
              ),
            },
          ],
        };
      }
      case "reddiy_scrape": {
        const { reddit_url } = args as { reddit_url: string };
        if (!reddit_url) {
          throw new Error("reddit_url is required");
        }

        const transcript = await fetchYouTubeTranscript(video_id);

        if (!transcript) {
          return {
            content: [
              {
                type: "text",
                text: `Transcript not available for video ${video_id}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  video_id,
                  duration: transcript.duration,
                  language: transcript.language,
                  text: transcript.text,
                  segments: transcript.segments,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default: {
        // Return a structured error for unknown tool names so the handler never returns undefined
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
      }
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// ✅ RESOURCES: Static content that can be read
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "sahyadriprep://placement-statistics",
        name: "Placement Statistics",
        description: "Overall placement statistics across all colleges",
        mimeType: "application/json",
      },
      {
        uri: "sahyadriprep://top-companies",
        name: "Top Companies",
        description: "List of top recruiting companies",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "sahyadriprep://placement-statistics": {
      const { data: colleges } = await supabase.from("colleges").select("*");

      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(colleges, null, 2),
          },
        ],
      };
    }

    case "sahyadriprep://top-companies": {
      const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(companies, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SahyadriPrep MCP Server running on stdio");
}

main().catch(console.error);
