"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface TournamentLayoutProps {
  activeTab: string;
  id: string;
  children: React.ReactNode;
}

export function TournamentLayout({ activeTab, id, children }: TournamentLayoutProps) {
  const tabs = [
    { id: "info", label: "Information" },
    { id: "scoreboard", label: "Scoreboard" },
    { id: "pairing", label: "Pairings" },
    { id: "results", label: "Confirm Results" },
  ];

  return (
    <div className="container px-4 md:px-6 mx-auto mt-8">
      <div className="flex border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/tournament/${id}?tab=${tab.id}`}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}
