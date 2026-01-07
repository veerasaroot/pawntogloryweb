"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("*").order("start_date", { ascending: false });
    if (data) setTournaments(data);
  };

  const deleteTournament = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      await supabase.from("tournaments").delete().eq("id", id);
      fetchTournaments();
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tournaments</h1>
          <Link href="/admin/tournaments/new" className="bg-foreground text-background px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-foreground/90">
             <Plus className="w-4 h-4" /> New Tournament
          </Link>
       </div>

       <div className="border border-border rounded-lg bg-background overflow-hidden relative">
          <table className="w-full text-left">
             <thead className="bg-muted/50 border-b border-border">
                <tr>
                   <th className="p-4 font-bold">Title</th>
                   <th className="p-4 font-bold">Date</th>
                   <th className="p-4 font-bold">Status</th>
                   <th className="p-4 font-bold text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {tournaments.map((t) => (
                   <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{t.title}</td>
                      <td className="p-4">{new Date(t.start_date).toLocaleDateString()}</td>
                      <td className="p-4">
                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            {t.status}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                            <Link href={`/admin/tournaments/${t.id}`} className="p-2 hover:bg-muted rounded text-blue-600">
                               <Edit className="w-4 h-4" />
                            </Link>
                             <button onClick={() => deleteTournament(t.id)} className="p-2 hover:bg-muted rounded text-red-600">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
