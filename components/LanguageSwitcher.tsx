"use client";

import { useLanguage } from "./LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 border border-input rounded-md p-1">
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-2 py-0.5 text-xs font-bold rounded transition-colors",
          language === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("th")}
        className={cn(
          "px-2 py-0.5 text-xs font-bold rounded transition-colors",
          language === "th" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        TH
      </button>
    </div>
  );
}
