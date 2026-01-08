"use client";

import { MuxPlayer } from "@/components/MuxPlayer";
import { createClient } from "@/lib/supabase/client";

interface MuxPlayerWrapperProps {
  playbackId: string;
  lessonId: string;
  title?: string;
}

export function MuxPlayerWrapper({
  playbackId,
  lessonId,
  title,
}: MuxPlayerWrapperProps) {
  const supabase = createClient();

  const handleEnded = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
  };

  return (
    <MuxPlayer
      playbackId={playbackId}
      title={title}
      className="rounded-lg shadow-2xl"
      onEnded={handleEnded}
    />
  );
}
