export interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
}

export interface YoutubeTranscript {
  video_id: string;
  duration: number;
  language: string;
  text: string;
  segments: any[]; // You can define a more specific type if needed
}

export interface RedditContent {
  url: string;
  content: string | null;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  reddit_urls?: string[];
  // Add other product fields as needed
}

export interface CompiledProductData {
  product: ProductData;
  youtube_data: {
    videos: YoutubeVideo[];
    transcripts: Array<{
      videoId: string;
      title: string;
      transcript: string | null;
    }>;
  };
  reddit_data: RedditContent[];
  user_id: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}