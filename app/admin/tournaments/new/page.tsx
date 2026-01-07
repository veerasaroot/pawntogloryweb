"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TournamentForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      start_date: formData.get("start_date"),
      max_players: formData.get("max_players") ? Number(formData.get("max_players")) : null,
      status: "upcoming"
    };

    const { error } = await supabase.from("tournaments").insert(data);
    if (!error) {
      router.push("/admin/tournaments");
      router.refresh();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Tournament</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input required name="title" className="w-full p-2 border rounded-md bg-background" />
        </div>
         <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea required name="description" rows={4} className="w-full p-2 border rounded-md bg-background" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input required name="start_date" type="datetime-local" className="w-full p-2 border rounded-md bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input name="location" placeholder="Online" className="w-full p-2 border rounded-md bg-background" />
          </div>
        </div>
         <div>
          <label className="block text-sm font-medium mb-2">Max Players (Optional)</label>
          <input name="max_players" type="number" className="w-full p-2 border rounded-md bg-background" />
        </div>
        <button disabled={loading} className="w-full bg-foreground text-background py-3 rounded-md font-bold hover:opacity-90">
          {loading ? "Saving..." : "Create Tournament"}
        </button>
      </form>
    </div>
  );
}
