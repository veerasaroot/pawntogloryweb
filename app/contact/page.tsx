"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-20 mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">{t("contact.title")}</h1>
      <div className="space-y-4">
        <p className="text-lg">
          <strong>{t("contact.email")}:</strong> support@pawntoglory.com
        </p>
        <p className="text-lg">
          <strong>{t("contact.phone")}:</strong> +66 81 234 5678
        </p>
        <p className="text-lg">
          <strong>{t("contact.address")}:</strong> 123 Chess Avenue, Bangkok,
          Thailand
        </p>
      </div>
    </div>
  );
}
