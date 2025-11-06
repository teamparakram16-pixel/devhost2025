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
import * as cheerio from "cheerio";

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
            video_id: { type: "string", description: "YouTube video ID" },
          },
          required: ["video_id"],
        },
      },
      {
        name: "youtube_search",
        description:
          "Search YouTube videos by keywords (returns lightweight metadata only)",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            maxResults: { type: "number" },
          },
          required: ["query"],
        },
      },
      {
        name: "google_search",
        description:
          "Search the web (Google Custom Search) and return lightweight results (title, link, snippet)",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            maxResults: { type: "number" },
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
            product_id: { type: "string" },
          },
          required: ["product_id"],
        },
      },
      {
        name: "reddit_scrape",
        description:
          "Scrape and extract a trimmed excerpt from a Reddit post/thread URL (POST /reddit/extract)",
        inputSchema: {
          type: "object",
          properties: {
            reddit_url: { type: "string" },
          },
          required: ["reddit_url"],
        },
      },
      {
        name: "summarize_search_hits",
        description:
          "Score and return the top-N most relevant hits from a list of search results (no deep fetch)",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            hits: { type: "array", items: { type: "object" } },
            maxResults: { type: "number" },
          },
          required: ["query", "hits"],
        },
      },
      {
        name: "expand_selected_sources",
        description:
          "Given selected hits (videoId/url), fetch detailed data: transcripts for videos and scraped text for reddit links",
        inputSchema: {
          type: "object",
          properties: {
            selections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" }, // 'video'|'reddit'|'link'
                  id: { type: "string" },
                  url: { type: "string" },
                  videoId: { type: "string" },
                  title: { type: "string" },
                },
              },
            },
          },
          required: ["selections"],
        },
      },
    ],
  };
});

// ✅ TOOL EXECUTION HANDLER
// helper: simple token overlap scorer
function scoreTextOverlap(query: string, text: string) {
  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const qSet = new Set(tokenize(query));
  const tTokens = tokenize(text);
  let matches = 0;
  for (const t of tTokens) if (qSet.has(t)) matches++;
  return {
    matches,
    tokenCount: tTokens.length,
    score: tTokens.length === 0 ? 0 : matches / Math.max(qSet.size, 1),
  };
}

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
      case "google_search": {
        const { query, maxResults = 5 } = args as {
          query: string;
          maxResults?: number;
        };
        if (!query) throw new Error("query is required");
        const apiKey =
          process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CX;
        if (!apiKey || !cx)
          throw new Error("Missing Google search API key or CX");
        const url = "https://www.googleapis.com/customsearch/v1";
        const resp = await axiosClient.get(url, {
          params: { key: apiKey, cx, q: query, num: Math.min(maxResults, 10) },
        });
        const items = resp?.data?.items || [];
        const lightweight = items.map((it: any) => ({
          title: it.title,
          link: it.link,
          snippet: it.snippet,
        }));
        return {
          content: [
            { type: "text", text: JSON.stringify(lightweight, null, 2) },
          ],
        };
      }

      case "reddit_scrape": {
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

      case "summarize_search_hits": {
        const {
          query,
          hits,
          maxResults = 5,
        } = args as { query: string; hits: any[]; maxResults?: number };
        if (!query || !Array.isArray(hits))
          throw new Error("query and hits are required");
        const scored = hits.map((h: any, idx: number) => {
          const title = (h.title || h.snippet || h.link || "").toString();
          const snippet = (h.snippet || "").toString();
          const { score, matches } = scoreTextOverlap(
            query,
            `${title} ${snippet}`
          );
          return {
            id: h.videoId || h.link || h.url || `hit_${idx}`,
            type: h.videoId
              ? "video"
              : h.link?.includes("reddit.com")
              ? "reddit"
              : "link",
            title: title,
            url: h.link || h.url || null,
            videoId: h.videoId || null,
            snippet,
            score,
            reason: `matched_tokens=${matches}`,
          };
        });
        scored.sort((a: any, b: any) => b.score - a.score);
        const selected = scored.slice(0, maxResults);
        return {
          content: [{ type: "text", text: JSON.stringify(selected, null, 2) }],
        };
      }

      case "expand_selected_sources": {
        const { selections } = args as { selections: any[] };
        if (!Array.isArray(selections))
          throw new Error("selections is required");
        const results: any[] = [];
        for (const s of selections) {
          try {
            if (s.type === "video" || s.videoId) {
              const vid = s.videoId || s.id;
              const transcript = await fetchYouTubeTranscript(vid);
              results.push({
                type: "video",
                id: vid,
                title: s.title || null,
                transcript_excerpt: transcript
                  ? transcript.text.slice(0, 5000)
                  : null,
                transcript_meta: transcript
                  ? {
                      duration: transcript.duration,
                      language: transcript.language,
                      segments: transcript.segments?.slice(0, 10),
                    }
                  : null,
              });
            } else if (
              s.type === "reddit" ||
              (s.url && s.url.includes("reddit.com"))
            ) {
              // call internal Next.js scraping endpoint
              const resp = await axiosClient.post("/reddit/extract", {
                url: s.url,
              });
              const body = resp?.data;
              const scraped = body?.scraped_data ?? body?.message ?? "";
              results.push({
                type: "reddit",
                id: s.id || s.url,
                url: s.url,
                title: s.title || null,
                excerpt: scraped?.slice(0, 20000) ?? null,
              });
            } else if (s.type === "link" && s.url) {
              const resp = await axiosClient.get(s.url, { timeout: 10_000 });
              const $ = cheerio.load(resp.data);
              const text = $("body").text().replace(/\s+/g, " ").trim();
              results.push({
                type: "link",
                id: s.id || s.url,
                url: s.url,
                title: s.title || null,
                excerpt: text.slice(0, 20000),
              });
            } else {
              results.push({ type: "unknown", id: s.id || null, raw: s });
            }
          } catch (err: any) {
            results.push({
              type: s.type || "unknown",
              id: s.id || s.url || null,
              error: String(err?.message || err),
            });
          }
        }
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
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
// server.setRequestHandler(ListResourcesRequestSchema, async () => {
//   return {
//     resources: [
//       {
//         uri: "sahyadriprep://placement-statistics",
//         name: "Placement Statistics",
//         description: "Overall placement statistics across all colleges",
//         mimeType: "application/json",
//       },
//       {
//         uri: "sahyadriprep://top-companies",
//         name: "Top Companies",
//         description: "List of top recruiting companies",
//         mimeType: "application/json",
//       },
//     ],
//   };
// });

// server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
//   const { uri } = request.params;

//   switch (uri) {
//     case "sahyadriprep://placement-statistics": {
//       const { data: colleges } = await supabase.from("colleges").select("*");

//       return {
//         contents: [
//           {
//             uri,
//             mimeType: "application/json",
//             text: JSON.stringify(colleges, null, 2),
//           },
//         ],
//       };
//     }

//     case "sahyadriprep://top-companies": {
//       const { data: companies } = await supabase
//         .from("companies")
//         .select("*")
//         .order("created_at", { ascending: false })
//         .limit(50);

//       return {
//         contents: [
//           {
//             uri,
//             mimeType: "application/json",
//             text: JSON.stringify(companies, null, 2),
//           },
//         ],
//       };
//     }

//     default:
//       throw new Error(`Unknown resource: ${uri}`);
//   }
// });

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DevHost2025 MCP Server running on stdio");
}

main().catch(console.error);
