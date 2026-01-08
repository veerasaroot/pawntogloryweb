"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { VideoUpload } from "@/components/VideoUpload";
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import Link from "next/link";

interface Lesson {
  id?: string;
  title: string;
  video_url?: string;
  mux_playback_id?: string;
  mux_asset_id?: string;
  order_index: number;
  isNew?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseEditPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState(0);
  const [published, setPublished] = useState(false);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    // Fetch course
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !courseData) {
      alert("Course not found");
      router.push("/admin/courses");
      return;
    }

    setCourse(courseData);
    setTitle(courseData.title);
    setDescription(courseData.description || "");
    setThumbnail(courseData.thumbnail || "");
    setPrice(courseData.price || 0);
    setPublished(courseData.published || false);

    // Fetch lessons
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (lessonsData) {
      setLessons(lessonsData);
    }

    setLoading(false);
  };

  const handleSaveCourse = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("courses")
      .update({
        title,
        description,
        thumbnail,
        price,
        published,
      })
      .eq("id", courseId);

    if (error) {
      alert("Error saving course: " + error.message);
    }
    setSaving(false);
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      title: "New Lesson",
      order_index: lessons.length,
      isNew: true,
    };
    setLessons([...lessons, newLesson]);
    setActiveLesson(lessons.length);
  };

  const updateLesson = (index: number, updates: Partial<Lesson>) => {
    const updated = [...lessons];
    updated[index] = { ...updated[index], ...updates };
    setLessons(updated);
  };

  const saveLesson = async (index: number) => {
    const lesson = lessons[index];
    setSaving(true);

    if (lesson.isNew || !lesson.id) {
      // Create new lesson
      const { data, error } = await supabase
        .from("lessons")
        .insert({
          course_id: courseId,
          title: lesson.title,
          video_url: lesson.video_url,
          mux_playback_id: lesson.mux_playback_id,
          mux_asset_id: lesson.mux_asset_id,
          order_index: lesson.order_index,
        })
        .select()
        .single();

      if (error) {
        alert("Error creating lesson: " + error.message);
      } else if (data) {
        const updated = [...lessons];
        updated[index] = { ...data, isNew: false };
        setLessons(updated);
      }
    } else {
      // Update existing lesson
      const { error } = await supabase
        .from("lessons")
        .update({
          title: lesson.title,
          video_url: lesson.video_url,
          mux_playback_id: lesson.mux_playback_id,
          mux_asset_id: lesson.mux_asset_id,
          order_index: lesson.order_index,
        })
        .eq("id", lesson.id);

      if (error) {
        alert("Error updating lesson: " + error.message);
      }
    }
    setSaving(false);
  };

  const deleteLesson = async (index: number) => {
    const lesson = lessons[index];
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    if (lesson.id) {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lesson.id);

      if (error) {
        alert("Error deleting lesson: " + error.message);
        return;
      }
    }

    const updated = lessons.filter((_, i) => i !== index);
    setLessons(updated);
    setActiveLesson(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">
            Update course details and lessons
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Course Details</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail
              </label>
              <ImageUpload onUpload={setThumbnail} defaultImage={thumbnail} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  id="published"
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="font-medium">
                  Published
                </label>
              </div>
            </div>

            <button
              onClick={handleSaveCourse}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>

        {/* Lessons Sidebar */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Lessons</h2>
              <button
                onClick={addLesson}
                className="p-2 bg-foreground text-background rounded-lg hover:bg-foreground/90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {lessons.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No lessons yet. Add your first lesson!
                </p>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id || index}
                    onClick={() =>
                      setActiveLesson(activeLesson === index ? null : index)
                    }
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeLesson === index
                        ? "border-foreground bg-muted/50"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium flex-1 truncate">
                        {index + 1}. {lesson.title}
                      </span>
                      {lesson.mux_playback_id && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded">
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Lesson Editor */}
          {activeLesson !== null && lessons[activeLesson] && (
            <div className="bg-background border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Edit Lesson</h3>
                <button
                  onClick={() => deleteLesson(activeLesson)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={lessons[activeLesson].title}
                  onChange={(e) =>
                    updateLesson(activeLesson, { title: e.target.value })
                  }
                  className="w-full p-2 border border-border rounded-lg bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video</label>
                <VideoUpload
                  onUpload={(playbackId, assetId) => {
                    updateLesson(activeLesson, {
                      mux_playback_id: playbackId,
                      mux_asset_id: assetId,
                    });
                  }}
                  defaultPlaybackId={lessons[activeLesson].mux_playback_id}
                />
              </div>

              <button
                onClick={() => saveLesson(activeLesson)}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-2 rounded-lg font-medium text-sm hover:bg-foreground/90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Lesson"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
