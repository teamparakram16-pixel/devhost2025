import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "../axiosClient";
import * as cheerio from "cheerio";

interface RequestFormat {
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url }: RequestFormat = await req.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL is required" },
        { status: 400 }
      );
    }

    const response = await axiosClient.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const pageText = $("body").text().replace(/\s+/g, " ").trim();

    return NextResponse.json({
      success: true,
      message: pageText,
    });
  } catch (error) {
    console.error("Scraping error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error in scraping webpage . "
      },
      { status: 500 }
    );
  }
}
