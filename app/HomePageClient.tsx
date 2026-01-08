"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.2 } },
};

interface Tournament {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
}

interface HomePageClientProps {
  tournaments: Tournament[];
  courses: Course[];
}

export function HomePageClient({ tournaments, courses }: HomePageClientProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden items-center flex justify-center bg-black text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-white text-black px-8 py-3 text-sm font-medium transition-colors hover:bg-gray-200"
            >
              {t("hero.join")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              {t("hero.learn")}
            </Link>
          </motion.div>
        </motion.div>
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-12 lg:grid-cols-2 items-center"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
              {/* Placeholder for Image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                About Image
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {t("about.title")}
              </h2>
              <p className="text-muted-foreground text-lg">{t("about.desc")}</p>
              <Link
                href="/about"
                className="text-foreground font-medium inline-flex items-center hover:underline"
              >
                {t("about.readmore")} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlight Tournament Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              {t("tour.title")}
            </h2>
            <Link
              href="/tournament"
              className="text-sm font-medium hover:underline"
            >
              {t("tour.viewall")}
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {tournaments.length > 0
              ? tournaments.map((tournament) => (
                  <motion.div
                    variants={fadeInUp}
                    key={tournament.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-background p-6 hover:border-foreground/50 transition-colors"
                  >
                    <Link href={`/tournament/${tournament.id}`}>
                      <h3 className="text-xl font-bold">{tournament.title}</h3>
                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {tournament.description || t("tour.card.desc")}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            tournament.status === "ongoing"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : tournament.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {t(`tour.status.${tournament.status}`) ||
                            tournament.status}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(tournament.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              : [1, 2, 3].map((i) => (
                  <motion.div
                    variants={fadeInUp}
                    key={i}
                    className="group relative overflow-hidden rounded-lg border border-border bg-background p-6"
                  >
                    <h3 className="text-xl font-bold text-muted-foreground">
                      {t("tour.empty.title")}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {t("tour.card.desc")}
                    </p>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Highlight Course Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              {t("course.title")}
            </h2>
            <Link
              href="/course"
              className="text-sm font-medium hover:underline"
            >
              {t("course.viewall")}
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {courses.length > 0
              ? courses.map((course) => (
                  <motion.div
                    variants={fadeInUp}
                    key={course.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-background p-0 hover:border-foreground/50 transition-colors"
                  >
                    <Link href={`/course/${course.id}`}>
                      {course.thumbnail ? (
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted w-full flex items-center justify-center text-muted-foreground">
                          No thumbnail
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                          {course.description || t("course.card.desc")}
                        </p>
                        <div className="mt-4">
                          <span className="font-bold text-lg">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              : [1, 2, 3].map((i) => (
                  <motion.div
                    variants={fadeInUp}
                    key={i}
                    className="group relative overflow-hidden rounded-lg border border-border bg-background p-0"
                  >
                    <div className="aspect-video bg-muted w-full" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-muted-foreground">
                        {t("course.empty.title")}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {t("course.card.desc")}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-12">
            {t("team.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white/10 mb-4" />
                <h3 className="font-bold">Grandmaster Name</h3>
                <p className="text-sm text-gray-400">{t("team.role")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container px-4 mx-auto max-w-2xl"
        >
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-lg font-medium transition-colors hover:bg-foreground/90"
          >
            {t("cta.button")}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
