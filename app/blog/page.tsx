import { createClient } from "@/lib/supabase/server";
import { BlogList } from "@/components/BlogList";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();

  // Fetch blogs
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <BlogList blogs={blogs || []} />;
}
