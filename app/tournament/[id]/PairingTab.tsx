"use client";

export function PairingTab({ matches }: { matches: any[] }) {
  return (
    <div className="space-y-6">
       {matches.length === 0 ? (
         <div className="py-12 text-center text-muted-foreground">
           No pairings generated yet.
         </div>
       ) : (
         <div className="grid gap-4">
            {matches.map((match) => (
               <div key={match.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                  <div className="font-medium">{match.player1?.user?.username || "Bye"}</div>
                  <div className="text-sm text-muted-foreground font-mono">VS</div>
                  <div className="font-medium">{match.player2?.user?.username || "Bye"}</div>
               </div>
            ))}
         </div>
       )}
    </div>
  );
}
