"use client";

export function ResultTab({ matches, user }: { matches: any[], user: any }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Submit Results</h3>
      {matches.length === 0 ? (
         <p className="text-muted-foreground">No active matches to report results for.</p>
      ) : (
         <div className="space-y-4">
            {matches.map((match) => (
               <div key={match.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div>
                    {match.player1?.user?.username} vs {match.player2?.user?.username}
                  </div>
                  <div>
                     {match.result ? (
                       <span className="font-bold">{match.result}</span>
                     ) : (
                       <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Pending</span>
                     )}
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
