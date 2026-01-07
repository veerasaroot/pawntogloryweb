"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const data = {
      title,
      slug,
      content: formData.get("content"), 
      cover_image: imageUrl,
      published: formData.get("published") === "on",
    };

    const { error } = await supabase.from("blogs").insert(data);
    if (!error) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input required name="title" className="w-full p-2 border rounded-md bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <ImageUpload onUpload={setImageUrl} />
        </div>
         <div>
          <label className="block text-sm font-medium mb-2">Content (HTML/Markdown)</label>
          <textarea required name="content" rows={10} className="w-full p-2 border rounded-md bg-background font-mono text-sm" />
          <p className="text-xs text-muted-foreground mt-1">Supports raw HTML or Markdown depending on renderer.</p>
        </div>
        <div className="flex items-center gap-2">
          <input name="published" type="checkbox" id="published" className="rounded border-gray-300" />
          <label htmlFor="published" className="text-sm font-medium">Publish Immediately</label>
        </div>
        <button disabled={loading} className="w-full bg-foreground text-background py-3 rounded-md font-bold hover:opacity-90">
          {loading ? "Saving..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
