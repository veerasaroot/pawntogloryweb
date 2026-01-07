"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-bold text-lg tracking-tight">
              Pawn to Glory
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              {t("footer.product")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/course"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.courses")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tournament"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.tournaments")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              {t("footer.social")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pawn to Glory.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
