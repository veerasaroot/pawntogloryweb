import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TournamentLayout } from "./layout-client";
import { InfoTab } from "./InfoTab";
import { ScoreboardTab } from "./ScoreboardTab";
import { PairingTab } from "./PairingTab";
import { ResultTab } from "./ResultTab";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function TournamentDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tournamentId = resolvedParams.id;
  const activeTab = resolvedSearchParams.tab || "info";

  const supabase = await createClient();

  // Fetch Tournament Data
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single();

  if (!tournament) {
    notFound();
  }

  // Fetch Current User
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Participants for Scoreboard
  const { data: participants } = await supabase
    .from("participants")
    .select("*, user:profiles(username, full_name, avatar_url)")
    .eq("tournament_id", tournamentId)
    .order("score", { ascending: false });

  // Fetch Matches for Pairing and Results
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      player1:participants(id, user:profiles(username, full_name)),
      player2:participants(id, user:profiles(username, full_name))
    `)
    .eq("tournament_id", tournamentId)
    .order("round", { ascending: false });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-black text-white py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold">{tournament.title}</h1>
          <p className="text-gray-400 mt-2 text-lg">{tournament.description}</p>
        </div>
      </div>

      <TournamentLayout activeTab={activeTab} id={tournamentId}>
        {activeTab === "info" && <InfoTab tournament={tournament} user={user} />}
        {activeTab === "scoreboard" && <ScoreboardTab participants={participants || []} />}
        {activeTab === "pairing" && <PairingTab matches={matches || []} />}
        {activeTab === "results" && <ResultTab matches={matches || []} user={user} />}
      </TournamentLayout>
    </div>
  );
}
