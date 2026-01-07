"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InfoTab({ tournament, user }: { tournament: any; user: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async () => {
    if (!user) return router.push(`/login?next=/tournament/${tournament.id}`);
    
    setLoading(true);
    const { error } = await supabase.from("participants").insert({
      tournament_id: tournament.id,
      user_id: user.id
    });

    if (error) {
      alert("Error registering: " + error.message);
    } else {
      alert("Successfully registered!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
       <div className="md:col-span-2 space-y-6">
          <div className="p-6 border border-border rounded-lg">
             <h3 className="text-xl font-bold mb-4">About this Tournament</h3>
             <p className="text-muted-foreground">{tournament.description}</p>
             <div className="mt-4 grid grid-cols-2 gap-4">
               <div>
                  <span className="text-sm font-bold block">Start Date</span>
                  <span className="text-muted-foreground">{new Date(tournament.start_date).toLocaleDateString()}</span>
               </div>
               <div>
                  <span className="text-sm font-bold block">Location</span>
                  <span className="text-muted-foreground">{tournament.location || "Online"}</span>
               </div>
             </div>
          </div>
       </div>
       <div>
          <button
            onClick={handleRegister}
            disabled={loading || tournament.status !== 'upcoming'}
            className="w-full py-4 bg-foreground text-background text-lg font-bold rounded-lg hover:bg-foreground/90 disabled:opacity-50"
          >
            {loading ? "Registering..." : 
             tournament.status === 'upcoming' ? "Register Now" : 
             "Registration Closed"}
          </button>
       </div>
    </div>
  );
}
