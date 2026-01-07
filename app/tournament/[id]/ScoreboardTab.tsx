"use client";

export function ScoreboardTab({ participants }: { participants: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 font-bold">Rank</th>
            <th className="py-3 px-4 font-bold">Player</th>
            <th className="py-3 px-4 font-bold">Score</th>
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 ? (
            <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">No participants yet.</td></tr>
          ) : (
            participants.map((p, idx) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted" /> 
                    {p.user?.full_name || p.user?.username || "Unknown"}
                  </div>
                </td>
                <td className="py-3 px-4 font-bold">{p.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
