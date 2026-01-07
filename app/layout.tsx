import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/components/LanguageContext";

const googleSans = localFont({
  src: [
    {
      path: './fonts/GoogleSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/GoogleSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/GoogleSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/GoogleSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/GoogleSans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: "--font-google-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Pawn to Glory",
  description: "Thai-English Multilanguage Chess Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          googleSans.variable
        )}
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
