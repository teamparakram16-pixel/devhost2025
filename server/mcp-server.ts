import { fetchYouTubeTranscript } from "@/helpers/youtube-video.helpers";
import { axiosClient } from "@/lib/axiosClient";
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
      {
        name: "youtube_search",
        description: "Search YouTube videos by keywords",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query keywords",
            },
            maxResults: {
              type: "number",
              description:
                "Maximum number of results to return (optional, default 5)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "fetch_product_details",
        description:
          "Fetch product details by product ID from the products table",
        inputSchema: {
          type: "object",
          properties: {
            product_id: {
              type: "string",
              description: "Product ID to look up in the products table",
            },
          },
          required: ["product_id"],
        },
      },
      {
        name: "reddiy_scrape",
        description:
          "Scrape and extract data from Reddit posts by URL without API key",
        inputSchema: {
          type: "object",
          properties: {
            reddit_url: {
              type: "string",
              description: "Reddit post or comment URL to scrape",
            },
          },
          required: ["reddit_url"],
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

      // Add this case in your CallToolRequestSchema handler:
      case "youtube_search": {
        const { query, maxResults = 5 } = args as {
          query: string;
          maxResults?: number;
        };
        if (!query) {
          throw new Error("query is required");
        }

        // Replace with your YouTube Data API v3 key
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!apiKey) {
          throw new Error("Missing YouTube API key");
        }

        const url = "https://www.googleapis.com/youtube/v3/search";

        const response = await axiosClient.get(url, {
          params: {
            key: apiKey,
            part: "snippet",
            q: query,
            maxResults: maxResults,
            type: "video",
          },
        });

        const items = response.data.items;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                items.map((item: any) => ({
                  videoId: item.id.videoId,
                  title: item.snippet.title,
                  description: item.snippet.description,
                  channelTitle: item.snippet.channelTitle,
                  publishedAt: item.snippet.publishedAt,
                })),
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

        const resp = await axiosClient.post<{ scraped_data: string }>(
          "/reddit/extract",
          {
            data: {
              reddit_url,
            },
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
            timeout: 15_000,
          }
        );

        const { scraped_data } = resp.data;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  scraped_data,
                },
                null,
                2
              ),
            },
          ],
        };
      }
      case "fetch_product_details": {
        const { product_id } = args as { product_id: string };
        if (!product_id) {
          throw new Error("product_id is required");
        }

        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", product_id)
          .single();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { error: error.message, product_id },
                  null,
                  2
                ),
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
                  product_id,
                  product,
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
