import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Create a new direct upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error: any) {
    console.error("MUX upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create upload URL" },
      { status: 500 }
    );
  }
}

// Get upload status and asset info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get("uploadId");

  if (!uploadId) {
    return NextResponse.json({ error: "Upload ID required" }, { status: 400 });
  }

  try {
    const upload = await mux.video.uploads.retrieve(uploadId);
    
    let playbackId = null;
    let assetId = upload.asset_id;
    
    if (assetId) {
      const asset = await mux.video.assets.retrieve(assetId);
      playbackId = asset.playback_ids?.[0]?.id;
    }

    return NextResponse.json({
      status: upload.status,
      assetId,
      playbackId,
    });
  } catch (error: any) {
    console.error("MUX status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get upload status" },
      { status: 500 }
    );
  }
}
