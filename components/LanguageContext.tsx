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
    "nav.dashboard": "Dashboard",
    "hero.title": "Pawn to Glory",
    "hero.subtitle":
      "The ultimate chess club. Join tournaments, master courses, and rise to the top.",
    "hero.join": "Join Now",
    "hero.learn": "Learn More",
    "about.title": "About Us",
    "about.desc":
      "We are a community of passionate chess players dedicated to growth, strategy, and sportsmanship.",
    "about.readmore": "Read our story",
    "tour.title": "Upcoming Tournaments",
    "tour.viewall": "View All",
    "tour.card.title": "Weekly Blitz",
    "tour.card.desc": "Join the fast-paced action every Saturday.",
    "tour.card.status": "Register Open",
    "course.title": "Featured Courses",
    "course.viewall": "View All",
    "course.card.title": "Mastering the Opening",
    "course.card.desc": "Learn the fundamental principles of opening play.",
    "team.title": "Meet Our Team",
    "team.role": "Head Coach",
    "cta.title": "Ready to Make Your Move?",
    "cta.subtitle":
      "Join Pawn to Glory today and start your journey to mastery.",
    "cta.button": "Get Started for Free",
    "footer.tagline": "Elevate your chess game.",
    "footer.product": "Product",
    "footer.courses": "Courses",
    "footer.tournaments": "Tournaments",
    "footer.company": "Company",
    "footer.social": "Social",
    "footer.rights": "All rights reserved.",
    "auth.login.title": "Sign in to your account",
    "auth.login.or": "Or",
    "auth.login.create": "create a new account",
    "auth.email_label": "Email address",
    "auth.email_placeholder": "Email address",
    "auth.password_label": "Password",
    "auth.password_placeholder": "Password",
    "auth.login.submit": "Sign in",
    "auth.login.submitting": "Signing in...",
    "auth.signup.title": "Create your account",
    "auth.signup.already": "Already have an account?",
    "auth.signup.signin": "Sign in",
    "auth.fullname_label": "Full Name",
    "auth.fullname_placeholder": "Full Name",
    "auth.signup.submit": "Sign up",
    "auth.signup.submitting": "Creating account...",
    "auth.signup.check_email": "Check your email for confirmation link!",
    "blog.title": "Chess News & Articles",
    "blog.subtitle":
      "Stay updated with the latest news, strategy guides, and club announcements.",
    "blog.empty.title": "No articles yet",
    "blog.empty.desc": "Our editors are writing the next masterpiece.",
    "blog.no_image": "No Image",
    "course.card.no_image": "No Image",
    "course.card.free": "FREE",
    "course.card.view": "View Course",
    "course.page.title": "Explore Courses",
    "course.page.desc":
      "Master the board with lessons from top players. From openings to endgames, we have everything you need to improve.",
    "course.empty.title": "No courses available yet",
    "course.empty.desc": "Check back soon for new content!",
    "tour.page.title": "Tournaments",
    "tour.page.desc":
      "Compete for glory. Join our Swiss-style tournaments and test your skills against the best.",
    "tour.empty.title": "No active tournaments",
    "tour.empty.desc": "Check back later for upcoming events.",
    "tour.status.ongoing": "Ongoing",
    "tour.status.upcoming": "Upcoming",
    "tour.status.completed": "Completed",
    "tour.location.online": "Online",
    "tour.max_players": "Max {n} Players",
    "tour.open_entry": "Open Entry",
    "tour.view_details": "View Details",
    "contact.title": "Contact Us",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.address": "Address",
    "about.page.title": "About Pawn to Glory",
    "about.page.desc1":
      "We are dedicated to elevating the chess community through professional tournaments, expert courses, and a vibrant club atmosphere.",
    "about.page.desc2":
      "Founded in 2024, Pawn to Glory has grown into a hub for players of all levels.",
    "upload.click": "Click to upload",
    "upload.drag": "or drag and drop",
    "upload.hint": "SVG, PNG, JPG or GIF (MAX. 2MB)",
    "upload.error": "Error uploading image: ",
    "upload.image_alt": "Uploaded image",
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
    "nav.dashboard": "แดชบอร์ด",
    "hero.title": "Pawn to Glory",
    "hero.subtitle":
      "สโมสรหมากรุกชั้นนำ เข้าร่วมการแข่งขัน เรียนรู้เทคนิค และก้าวสู่ความเป็นเลิศ",
    "hero.join": "สมัครสมาชิก",
    "hero.learn": "เรียนรู้เพิ่มเติม",
    "about.title": "เกี่ยวกับเรา",
    "about.desc":
      "เราคือชุมชนคนรักหมากรุกที่มุ่งมั่นในการเรียนรู้ กลยุทธ์ และน้ำใจนักกีฬา",
    "about.readmore": "อ่านเรื่องราวของเรา",
    "tour.title": "การแข่งขันที่กำลังจะมาถึง",
    "tour.viewall": "ดูทั้งหมด",
    "tour.card.title": "การแข่งขัน Weekly Blitz",
    "tour.card.desc": "เข้าร่วมการแข่งขันอันดุเดือดทุกวันเสาร์",
    "tour.card.status": "เปิดรับสมัคร",
    "course.title": "คอร์สแนะนำ",
    "course.viewall": "ดูทั้งหมด",
    "course.card.title": "เจาะลึกการเปิดหมาก",
    "course.card.desc": "เรียนรู้หลักการพื้นฐานของการเปิดหมากอย่างถูกวิธี",
    "team.title": "ทีมงานของเรา",
    "team.role": "หัวหน้าผู้ฝึกสอน",
    "cta.title": "พร้อมที่จะเดินหมากของคุณหรือยัง?",
    "cta.subtitle":
      "เข้าร่วม Pawn to Glory วันนี้และเริ่มต้นเส้นทางสู่ความเป็นเซียน",
    "cta.button": "เริ่มต้นใช้งานฟรี",
    "footer.tagline": "ยกระดับเกมหมากรุกของคุณ",
    "footer.product": "ผลิตภัณฑ์",
    "footer.courses": "คอร์สเรียน",
    "footer.tournaments": "การแข่งขัน",
    "footer.company": "บริษัท",
    "footer.social": "โซเชียลมีเดีย",
    "footer.rights": "สงวนลิขสิทธิ์",
    "auth.login.title": "เข้าสู่ระบบบัญชีของคุณ",
    "auth.login.or": "หรือ",
    "auth.login.create": "สร้างบัญชีใหม่",
    "auth.email_label": "อีเมล",
    "auth.email_placeholder": "อีเมล",
    "auth.password_label": "รหัสผ่าน",
    "auth.password_placeholder": "รหัสผ่าน",
    "auth.login.submit": "เข้าสู่ระบบ",
    "auth.login.submitting": "กำลังเข้าสู่ระบบ...",
    "auth.signup.title": "สร้างบัญชีของคุณ",
    "auth.signup.already": "มีบัญชีอยู่แล้ว?",
    "auth.signup.signin": "เข้าสู่ระบบ",
    "auth.fullname_label": "ชื่อ-นามสกุล",
    "auth.fullname_placeholder": "ชื่อ-นามสกุล",
    "auth.signup.submit": "ลงทะเบียน",
    "auth.signup.submitting": "กำลังสร้างบัญชี...",
    "auth.signup.check_email": "ตรวจสอบอีเมลของคุณเพื่อยืนยันการลงทะเบียน!",
    "blog.title": "ข่าวสารและบทความหมากรุก",
    "blog.subtitle": "ติดตามข่าวสารล่าสุด กลยุทธ์ และประกาศจากสโมสร",
    "blog.empty.title": "ยังไม่มีบทความ",
    "blog.empty.desc": "บรรณาธิการของเรากำลังเขียนผลงานชิ้นเอกอยู่",
    "blog.no_image": "ไม่มีรูปภาพ",
    "course.card.no_image": "ไม่มีรูปภาพ",
    "course.card.free": "ฟรี",
    "course.card.view": "ดูคอร์ส",
    "course.page.title": "สำรวจคอร์สเรียน",
    "course.page.desc":
      "เรียนรู้จากผู้เล่นชั้นนำ ตั้งแต่การเปิดหมากจนถึงจุดจบกระดาน",
    "course.empty.title": "ยังไม่มีคอร์สเรียน",
    "course.empty.desc": "กลับมาตรวจสอบใหม่เร็วๆ นี้!",
    "tour.page.title": "การแข่งขัน",
    "tour.page.desc": "เข้าร่วมการแข่งขันแบบ Swiss-style และทดสอบฝีมือของคุณ",
    "tour.empty.title": "ไม่มีการแข่งขันที่เปิดอยู่",
    "tour.empty.desc": "กลับมาตรวจสอบใหม่ภายหลังสำหรับกิจกรรมที่กำลังจะมาถึง",
    "tour.status.ongoing": "กำลังแข่งขัน",
    "tour.status.upcoming": "กำลังจะเริ่ม",
    "tour.status.completed": "จบแล้ว",
    "tour.location.online": "ออนไลน์",
    "tour.max_players": "สูงสุด {n} คน",
    "tour.open_entry": "ไม่จำกัดจำนวน",
    "tour.view_details": "ดูรายละเอียด",
    "contact.title": "ติดต่อเรา",
    "contact.email": "อีเมล",
    "contact.phone": "โทรศัพท์",
    "contact.address": "ที่อยู่",
    "about.page.title": "เกี่ยวกับ Pawn to Glory",
    "about.page.desc1":
      "เรามุ่งมั่นที่จะยกระดับชุมชนหมากรุกผ่านการจัดการแข่งขันระดับมืออาชีพ คอร์สเรียนจากผู้เชี่ยวชาญ และบรรยากาศสโมสรที่เต็มไปด้วยชีวิตชีวา",
    "about.page.desc2":
      "ก่อตั้งขึ้นในปี 2024, Pawn to Glory ได้เติบโตจนกลายเป็นศูนย์กลางสำหรับผู้เล่นทุกระดับ",
    "upload.click": "คลิกเพื่ออัปโหลด",
    "upload.drag": "หรือลากไฟล์มาวาง",
    "upload.hint": "SVG, PNG, JPG หรือ GIF (สูงสุด 2MB)",
    "upload.error": "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ",
    "upload.image_alt": "รูปภาพที่อัปโหลด",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

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
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
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
