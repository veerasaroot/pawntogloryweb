import { createClient } from "@/lib/supabase/server";
import { TournamentList } from "@/components/TournamentList";

export const revalidate = 60;

export default async function TournamentPage() {
  const supabase = await createClient();

  // Fetch upcoming tournaments
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .neq("status", "completed") // detailed filtering later
    .order("start_date", { ascending: true });

  return <TournamentList tournaments={tournaments || []} />;
}
