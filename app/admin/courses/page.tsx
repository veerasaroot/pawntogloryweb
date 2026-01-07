"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) setCourses(data);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Courses</h1>
          <Link href="/admin/courses/new" className="bg-foreground text-background px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-foreground/90">
             <Plus className="w-4 h-4" /> New Course
          </Link>
       </div>

       <div className="border border-border rounded-lg bg-background overflow-hidden relative">
          <table className="w-full text-left">
             <thead className="bg-muted/50 border-b border-border">
                <tr>
                   <th className="p-4 font-bold">Title</th>
                   <th className="p-4 font-bold">Status</th>
                   <th className="p-4 font-bold">Price</th>
                   <th className="p-4 font-bold text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {courses.map((course) => (
                   <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{course.title}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {course.published ? 'Published' : 'Draft'}
                         </span>
                      </td>
                      <td className="p-4">{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                            <Link href={`/admin/courses/${course.id}`} className="p-2 hover:bg-muted rounded text-blue-600">
                               <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteCourse(course.id)} className="p-2 hover:bg-muted rounded text-red-600">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
