import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HomePageClient } from "./HomePageClient";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const supabase = await createClient();

  // Fetch latest tournaments
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("id, title, description, status, start_date")
    .neq("status", "completed")
    .order("start_date", { ascending: true })
    .limit(3);

  // Fetch latest courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, thumbnail, price")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <HomePageClient tournaments={tournaments || []} courses={courses || []} />
  );
}
