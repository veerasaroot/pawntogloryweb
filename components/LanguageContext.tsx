"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "th";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.blog": "Blog",
    "nav.tournament": "Tournament",
    "nav.course": "Course",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "hero.title": "Pawn to Glory",
    "hero.subtitle": "The ultimate chess club. Join tournaments, master courses, and rise to the top.",
    "hero.join": "Join Now",
    "hero.learn": "Learn More",
    "about.title": "About Us",
    "about.desc": "We are a community of passionate chess players dedicated to growth, strategy, and sportsmanship.",
    "about.readmore": "Read our story",
    "tour.title": "Upcoming Tournaments",
    "tour.viewall": "View All",
    "course.title": "Featured Courses",
    "course.viewall": "View All",
    "team.title": "Meet Our Team",
    "cta.title": "Ready to Make Your Move?",
    "cta.subtitle": "Join Pawn to Glory today and start your journey to mastery.",
    "cta.button": "Get Started for Free",
  },
  th: {
    "nav.home": "หน้าแรก",
    "nav.about": "เกี่ยวกับเรา",
    "nav.contact": "ติดต่อเรา",
    "nav.blog": "บทความ",
    "nav.tournament": "การแข่งขัน",
    "nav.course": "คอร์สเรียน",
    "nav.login": "เข้าสู่ระบบ",
    "nav.signup": "ลงทะเบียน",
    "hero.title": "Pawn to Glory",
    "hero.subtitle": "สโมสรหมากรุกชั้นนำ เข้าร่วมการแข่งขัน เรียนรู้เทคนิค และก้าวสู่ความเป็นเลิศ",
    "hero.join": "สมัครสมาชิก",
    "hero.learn": "เรียนรู้เพิ่มเติม",
    "about.title": "เกี่ยวกับเรา",
    "about.desc": "เราคือชุมชนคนรักหมากรุกที่มุ่งมั่นในการเรียนรู้ กลยุทธ์ และน้ำใจนักกีฬา",
    "about.readmore": "อ่านเรื่องราวของเรา",
    "tour.title": "การแข่งขันที่กำลังจะมาถึง",
    "tour.viewall": "ดูทั้งหมด",
    "course.title": "คอร์สแนะนำ",
    "course.viewall": "ดูทั้งหมด",
    "team.title": "ทีมงานของเรา",
    "cta.title": "พร้อมที่จะเดินหมากของคุณหรือยัง?",
    "cta.subtitle": "เข้าร่วม Pawn to Glory วันนี้และเริ่มต้นเส้นทางสู่ความเป็นเซียน",
    "cta.button": "เริ่มต้นใช้งานฟรี",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
