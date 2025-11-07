import { axiosClient } from "@/lib/axiosClient";

export async function googleSearch(query: string, maxResults: number = 5) {
  if (!query) {
    throw new Error("Search query is required");
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  
  if (!apiKey || !cx) {
    throw new Error("Missing Google search API key or CX");
  }

  const resp = await axiosClient.get("https://www.googleapis.com/customsearch/v1", {
    params: { 
      key: apiKey, 
      cx, 
      q: query, 
      num: Math.min(maxResults, 10) 
    },
  });

  const items = resp?.data?.items || [];
  return items.map((it: any) => ({
    title: it.title,
    link: it.link,
    snippet: it.snippet,
  }));
}