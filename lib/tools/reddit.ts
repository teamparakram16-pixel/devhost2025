import { axiosClient } from "@/lib/axiosClient";

export async function redditScrape(redditUrl: string) {
  if (!redditUrl) {
    throw new Error("Reddit URL is required");
  }

  const resp = await axiosClient.post<{ scraped_data: string }>("/api/reddit/extract", {
    data: {
      reddit_url: redditUrl,
    },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    timeout: 15_000,
  });

  return {
    scraped_data: resp.data.scraped_data,
  };
}