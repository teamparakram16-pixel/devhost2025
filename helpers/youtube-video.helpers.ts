export interface TranscriptData {
  text: string;
  segments: TranscriptSegment[];
  duration: number;
  language: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
  index?: number;
}

export const fetchYouTubeTranscript = async (
  videoId: string
): Promise<TranscriptData | null> => {
  try {
    const { Innertube } = await import("youtubei.js");

    console.log("🔍 Retrieving transcript for video ID:", videoId);

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);

    console.log("📹 Video info retrieved:", {
      title: info.basic_info.title,
      author: info.basic_info.author,
      duration: info.basic_info.duration,
    });

    // ✅ Check available caption tracks
    const captionTracks = info.captions?.caption_tracks || [];
    console.log(
      "📋 Available caption tracks:",
      captionTracks.map((track: any) => ({
        language: track.language_code,
        name: track.name?.text,
        is_translatable: track.is_translatable,
      }))
    );

    // ✅ Check if English captions exist
    const englishTrack = captionTracks.find(
      (track: any) =>
        track.language_code === "en" || track.language_code?.startsWith("en-")
    );

    if (!englishTrack) {
      console.error("❌ No native English transcript available");

      // 🔮 TODO: Future implementation with FastAPI
      // When English transcript is not available, call FastAPI endpoint
      // to get translated transcript using Python youtube-transcript-api
      //
      // Example:
      // const response = await fetch(`${FASTAPI_BASE_URL}/api/transcript/${videoId}`);
      // const data = await response.json();
      // return processTranscriptData(data);

      throw new Error(
        "English transcript not available. Translation service not yet implemented."
      );
    }

    console.log("✅ Found native English transcript track");
    const transcriptData: any = await info.getTranscript();

    // ✅ Process native English transcript
    console.log("📝 Processing transcript data...");

    let segments: any[] | undefined;

    if (transcriptData?.transcript?.content?.body?.initial_segments) {
      segments = transcriptData.transcript.content.body.initial_segments;
    } else if (transcriptData?.content?.body?.initial_segments) {
      segments = transcriptData.content.body.initial_segments;
    } else if (transcriptData?.actions) {
      segments = transcriptData.actions;
    } else if (Array.isArray(transcriptData)) {
      segments = transcriptData;
    } else if (transcriptData?.segments) {
      segments = transcriptData.segments;
    }

    if (!segments || segments.length === 0) {
      console.log("❌ No segments found");
      return null;
    }

    console.log(`📊 Found ${segments.length} transcript segments`);

    // Map segments
    const mappedSegments: TranscriptSegment[] = segments.map((item: any) => {
      const text = item.snippet?.text || item.text || "";
      const startMs = parseInt(item.start_ms || "0", 10);
      const endMs = parseInt(item.end_ms || "0", 10);

      return {
        text: text.trim(),
        start: startMs / 1000,
        duration: (endMs - startMs) / 1000,
      };
    });

    const validSegments = mappedSegments.filter((seg) => seg.text.length > 0);

    if (validSegments.length === 0) {
      console.log("❌ All segments are empty");
      return null;
    }

    const fullText = validSegments.map((s) => s.text).join(" ");

    // ✅ Check if text is actually English
    const isEnglish = /^[\x00-\x7F]*$/.test(fullText.slice(0, 100));
    if (!isEnglish) {
      console.warn("⚠️ Transcript appears to be non-English, skipping");
      return null;
    }

    const totalDuration =
      validSegments[validSegments.length - 1].start +
      validSegments[validSegments.length - 1].duration;

    console.log("✅ Transcript processed successfully:", {
      characters: fullText.length,
      segments: validSegments.length,
      duration: Math.round(totalDuration),
      firstSegment: fullText.slice(0, 50) + "...",
    });

    return {
      text: fullText,
      segments: validSegments,
      duration: Math.round(totalDuration),
      language: "en",
    };
  } catch (error: any) {
    console.error("❌ Error fetching transcript:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    });
    return null;
  }
};
