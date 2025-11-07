import { axiosClient } from "@/lib/axiosClient";
import { fetchYouTubeTranscript } from "@/helpers/youtube-video.helpers";

export async function getYoutubeTranscript(videoId: string) {
  if (!videoId) {
    throw new Error("Video ID is required");
  }

  const transcript = await fetchYouTubeTranscript(videoId);
  if (!transcript) {
    throw new Error(`Transcript not available for video ${videoId}`);
  }

  return {
    video_id: videoId,
    duration: transcript.duration,
    language: transcript.language,
    text: transcript.text,
    segments: transcript.segments,
  };
}

export async function searchYoutube(query: string, maxResults: number = 5) {
  if (!query) {
    throw new Error("Search query is required");
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YouTube API key");
  }

  const response = await axiosClient.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: apiKey,
      part: "snippet",
      q: query,
      maxResults: maxResults,
      type: "video",
    },
  });

  return response.data.items.map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}