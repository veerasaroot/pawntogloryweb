import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, PlayCircle, CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const supabase = await createClient();

  // 1. Fetch Course Details
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // 2. Fetch Lessons
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  // 3. User Auth Status
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background pb-20">
       {/* Header */}
       <div className="bg-muted/30 py-12 border-b border-border">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="grid md:grid-cols-3 gap-8 items-start">
               <div className="md:col-span-2 space-y-4">
                 <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Link href="/course" className="hover:text-foreground hover:underline">Courses</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium truncate">{course.title}</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{course.title}</h1>
                 <p className="text-xl text-muted-foreground leading-relaxed">{course.description}</p>
                 <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center -space-x-2">
                       {/* Mock Avatars */}
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gray-300" />)}
                    </div>
                    <span className="text-sm text-muted-foreground">Joined by 100+ students</span>
                 </div>
               </div>
               
               {/* Quick Info / Buy Card */}
               <div className="md:col-span-1 bg-background border border-border rounded-xl p-6 shadow-sm sticky top-24">
                  {course.thumbnail && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6 bg-muted">
                       <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="mb-6">
                     <span className="text-3xl font-bold">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                  </div>
                  {!user ? (
                    <Link href={`/login?next=/course/${courseId}`} className="w-full text-center block bg-foreground text-background py-3 rounded-md font-medium hover:bg-foreground/90 transition-colors">
                      Login to Watch
                    </Link>
                  ) : (
                     <div className="w-full bg-green-100 text-green-800 text-center py-3 rounded-md font-medium dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                       Currently Available
                     </div>
                  )}
               </div>
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="container px-4 md:px-6 mx-auto mt-12 grid md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <div className="space-y-4">
               {!lessons || lessons.length === 0 ? (
                 <p className="text-muted-foreground italic">No lessons added yet.</p>
               ) : (
                 lessons.map((lesson, idx) => (
                   <div key={lesson.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors group">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-grow">
                         <h3 className="font-medium">{lesson.title}</h3>
                         <span className="text-xs text-muted-foreground">Video Lesson</span>
                      </div>
                      <div>
                        {user ? (
                           <Link href={`/course/${courseId}/lesson/${lesson.id}`} className="p-2 text-foreground/70 hover:text-foreground">
                              <PlayCircle className="w-6 h-6" />
                           </Link>
                        ) : (
                           <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>

       </div>
    </div>
  );
}
