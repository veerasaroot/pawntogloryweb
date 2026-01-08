"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Film, CheckCircle } from "lucide-react";

interface VideoUploadProps {
  onUpload: (playbackId: string, assetId: string) => void;
  defaultPlaybackId?: string;
  className?: string;
}

export function VideoUpload({
  onUpload,
  defaultPlaybackId,
  className,
}: VideoUploadProps) {
  const [playbackId, setPlaybackId] = useState<string | undefined>(
    defaultPlaybackId
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      setStatus("Getting upload URL...");

      // Get upload URL from our API
      const urlResponse = await fetch("/api/mux/upload", {
        method: "POST",
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, uploadId } = await urlResponse.json();

      setStatus("Uploading video...");

      // Upload directly to MUX
      const uploadResponse = await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("PUT", uploadUrl);
        xhr.send(file);
      });

      setStatus("Processing video...");
      setProgress(100);

      // Poll for asset status
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes max

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusResponse = await fetch(
          `/api/mux/upload?uploadId=${uploadId}`
        );
        const statusData = await statusResponse.json();

        if (statusData.status === "asset_created" && statusData.playbackId) {
          setPlaybackId(statusData.playbackId);
          onUpload(statusData.playbackId, statusData.assetId);
          setStatus("Upload complete!");
          setUploading(false);
          return;
        }

        if (statusData.status === "errored") {
          throw new Error("Video processing failed");
        }

        attempts++;
        setStatus(`Processing video... (${attempts * 2}s)`);
      }

      throw new Error("Video processing timed out");
    } catch (error: any) {
      console.error("Upload error:", error);
      setStatus(`Error: ${error.message}`);
      alert("Error uploading video: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setPlaybackId(undefined);
    setProgress(0);
    setStatus("");
    onUpload("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {playbackId ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border group bg-black">
          <img
            src={`https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="font-medium">Video uploaded</span>
            </div>
          </div>
          <button
            onClick={removeVideo}
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-border">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
                  <p className="mb-2 text-sm text-muted-foreground">{status}</p>
                  {progress > 0 && (
                    <div className="w-48 bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-foreground h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Film className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload video</span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, MOV, WebM (max 5GB)
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
