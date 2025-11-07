import { axiosClient } from "@/lib/axiosClient";
import { fetchYouTubeTranscript } from "@/helpers/youtube-video.helpers";
import * as cheerio from "cheerio";

export function summarizeSearchHits(query: string, hits: any[], maxResults: number = 5) {
  if (!query) {
    throw new Error("Query is required");
  }
  if (!hits || !Array.isArray(hits)) {
    throw new Error("Hits array is required");
  }

  function scoreTextOverlap(query: string, text: string) {
    const tokenize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
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

  const scored = hits.map((h: any, idx: number) => {
    const title = (h.title || h.snippet || h.link || "").toString();
    const snippet = (h.snippet || "").toString();
    const { score, matches } = scoreTextOverlap(query, `${title} ${snippet}`);
    return {
      id: h.videoId || h.link || h.url || `hit_${idx}`,
      type: h.videoId ? "video" : h.link?.includes("reddit.com") ? "reddit" : "link",
      title: title,
      url: h.link || h.url || null,
      videoId: h.videoId || null,
      snippet,
      score,
      reason: `matched_tokens=${matches}`,
    };
  });

  scored.sort((a: any, b: any) => b.score - a.score);
  return scored.slice(0, maxResults);
}

export async function expandSelectedSources(selections: any[]) {
  if (!selections || !Array.isArray(selections)) {
    throw new Error("Selections array is required");
  }

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
          transcript_excerpt: transcript ? transcript.text.slice(0, 5000) : null,
          transcript_meta: transcript ? {
            duration: transcript.duration,
            language: transcript.language,
            segments: transcript.segments?.slice(0, 10),
          } : null,
        });
      } else if (s.type === "reddit" || (s.url && s.url.includes("reddit.com"))) {
        const resp = await axiosClient.post("/api/reddit/extract", { url: s.url });
        const scraped = resp?.data?.scraped_data ?? resp?.data?.message ?? "";
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
      }
    } catch (error: any) {
      results.push({
        type: s.type || "unknown",
        id: s.id || s.url || null,
        error: String(error?.message || error),
      });
    }
  }
  return results;
}