"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";

interface BlogListProps {
  blogs: any[];
}

export function BlogList({ blogs }: BlogListProps) {
  const { t } = useLanguage();

  return (
    <div className="container py-12 md:py-20 mx-auto px-4 md:px-6">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t("blog.title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-[700px]">
          {t("blog.subtitle")}
        </p>
      </div>

      {!blogs || blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
          <h3 className="text-xl font-bold mb-2">{t("blog.empty.title")}</h3>
          <p className="text-muted-foreground">{t("blog.empty.desc")}</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-muted">
                {blog.cover_image ? (
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    {t("blog.no_image")}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {/* Strip HTML simplified or just show excerpt if exists */}
                  {(blog.content || "")
                    .replace(/<[^>]*>?/gm, "")
                    .substring(0, 150)}
                  ...
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  {blog.author?.avatar_url && (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={blog.author.avatar_url}
                        alt="Author"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span>{blog.author?.full_name || "Admin"}</span>
                  <span>•</span>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
