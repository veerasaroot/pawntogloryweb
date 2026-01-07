import { createClient } from "@/lib/supabase/server";
import { CourseList } from "@/components/CourseList";

export const revalidate = 60; // Revalidate every minute

export default async function CoursePage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <CourseList courses={courses || []} />;
}
