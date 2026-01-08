import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MuxPlayerWrapper } from "./MuxPlayerWrapper";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id: courseId, lessonId } = resolvedParams;
  const supabase = await createClient();

  // Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/course/${courseId}/lesson/${lessonId}`);
  }

  // Fetch Lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  const hasMuxVideo = !!lesson.mux_playback_id;
  const hasDirectVideo = !!lesson.video_url;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="shrink-0 p-4 border-b border-white/10 flex items-center gap-4">
        <Link
          href={`/course/${courseId}`}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-medium truncate">{lesson.title}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 p-4 md:p-8">
        {hasMuxVideo ? (
          <div className="w-full max-w-5xl">
            <MuxPlayerWrapper
              playbackId={lesson.mux_playback_id}
              lessonId={lessonId}
              title={lesson.title}
            />
          </div>
        ) : hasDirectVideo ? (
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
            {lesson.video_url.includes("youtube") ||
            lesson.video_url.includes("youtu.be") ? (
              <iframe
                src={lesson.video_url.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <video controls className="w-full h-full">
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : (
          <div className="text-center p-12">
            <p className="text-muted-foreground">
              Video source not found or pending upload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
