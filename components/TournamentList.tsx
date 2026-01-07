"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface TournamentListProps {
  tournaments: any[];
}

export function TournamentList({ tournaments }: TournamentListProps) {
  const { t } = useLanguage();

  return (
    <div className="container py-12 md:py-20 mx-auto px-4 md:px-6">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t("tour.page.title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-[700px]">
          {t("tour.page.desc")}
        </p>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
          <h3 className="text-xl font-bold mb-2">{t("tour.empty.title")}</h3>
          <p className="text-muted-foreground">{t("tour.empty.desc")}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournament/${tournament.id}`}
              className="group relative flex flex-col md:flex-row gap-6 p-6 border border-border rounded-xl bg-background hover:border-foreground/50 transition-colors"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {tournament.title}
                  </h3>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      tournament.status === "ongoing"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : tournament.status === "upcoming"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    {t(`tour.status.${tournament.status}`)}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  {tournament.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tournament.location || t("tour.location.online")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {tournament.max_players
                      ? t("tour.max_players").replace(
                          "{n}",
                          tournament.max_players.toString()
                        )
                      : t("tour.open_entry")}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:border-l md:pl-6 border-border">
                <span className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-2 text-sm font-medium transition-colors group-hover:bg-foreground/90">
                  {t("tour.view_details")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
