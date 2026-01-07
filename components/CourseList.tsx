"use client";

import { useLanguage } from "@/components/LanguageContext";
import { CourseCard } from "@/components/CourseCard";

interface CourseListProps {
  courses: any[];
}

export function CourseList({ courses }: CourseListProps) {
  const { t } = useLanguage();

  return (
    <div className="container py-12 md:py-20 mx-auto px-4 md:px-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("course.page.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-[700px]">
            {t("course.page.desc")}
          </p>
        </div>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
          <h3 className="text-xl font-bold mb-2">{t("course.empty.title")}</h3>
          <p className="text-muted-foreground">{t("course.empty.desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description || ""}
              thumbnail={course.thumbnail}
              price={course.price || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
