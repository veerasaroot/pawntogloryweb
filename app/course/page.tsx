import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/CourseCard";

export const revalidate = 60; // Revalidate every minute

export default async function CoursePage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-12 md:py-20 mx-auto px-4 md:px-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Explore Courses
          </h1>
          <p className="text-muted-foreground text-lg max-w-[700px]">
             Master the board with lessons from top players. From openings to endgames, we have everything you need to improve.
          </p>
        </div>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
          <h3 className="text-xl font-bold mb-2">No courses available yet</h3>
          <p className="text-muted-foreground">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description || ""}
              thumbnail={course.thumbnail}
              price={course.price || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
