"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";

export default function CourseForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      published: formData.get("published") === "on",
      thumbnail: imageUrl
    };

    const { error } = await supabase.from("courses").insert(data);
    if (!error) {
      router.push("/admin/courses");
      router.refresh();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input required name="title" className="w-full p-2 border rounded-md bg-background" />
        </div>
         <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <ImageUpload onUpload={setImageUrl} />
         </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea required name="description" rows={4} className="w-full p-2 border rounded-md bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input required name="price" type="number" defaultValue={0} min={0} className="w-full p-2 border rounded-md bg-background" />
        </div>
        <div className="flex items-center gap-2">
          <input name="published" type="checkbox" id="published" className="rounded border-gray-300" />
          <label htmlFor="published" className="text-sm font-medium">Publish Immediately</label>
        </div>
        <button disabled={loading} className="w-full bg-foreground text-background py-3 rounded-md font-bold hover:opacity-90">
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
