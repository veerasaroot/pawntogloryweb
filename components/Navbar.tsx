"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.tournament"), href: "/tournament" },
    { name: t("nav.course"), href: "/course" },
  ];

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Placeholder for Logo */}
            <div className="w-8 h-8 bg-foreground rounded-full" />
            <Link href="/" className="font-bold text-xl tracking-tight">
              Pawn to Glory
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <LanguageSwitcher />
             <Link
              href="/login"
              className="text-sm font-medium hover:text-primary/80 transition-colors"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/signup"
              className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              {t("nav.signup")}
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
               <Link
                href="/login"
                className="w-full text-center px-4 py-2 border border-border rounded-md"
                 onClick={() => setIsOpen(false)}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/signup"
                className="w-full text-center px-4 py-2 bg-foreground text-background rounded-md"
                 onClick={() => setIsOpen(false)}
              >
                {t("nav.signup")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
