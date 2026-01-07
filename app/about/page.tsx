"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-20 mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">{t("about.page.title")}</h1>
      <p className="text-lg text-muted-foreground mb-4">
        {t("about.page.desc1")}
      </p>
      <p className="text-lg text-muted-foreground">{t("about.page.desc2")}</p>
    </div>
  );
}
