"use client";

import { useEffect, useRef } from "react";

interface MuxPlayerProps {
  playbackId: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export function MuxPlayer({
  playbackId,
  title,
  poster,
  autoPlay = false,
  onEnded,
  className,
}: MuxPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // MUX stream URL
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
  const posterUrl =
    poster || `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if HLS is natively supported
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else {
      // For browsers that don't support HLS natively, use MP4 fallback
      // MUX provides MP4 renditions we can use
      const mp4Url = `https://stream.mux.com/${playbackId}/high.mp4`;
      video.src = mp4Url;
    }
  }, [playbackId, streamUrl]);

  if (!playbackId) {
    return (
      <div
        className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        controls
        autoPlay={autoPlay}
        poster={posterUrl}
        playsInline
        className="w-full h-full"
        title={title}
        onEnded={onEnded}
      >
        {/* Fallback sources */}
        <source
          src={`https://stream.mux.com/${playbackId}/high.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
