"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  price,
  className,
}: CourseCardProps) {
  return (
    <Link
      href={`/course/${id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-all hover:border-foreground/50 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {thumbnail ? (
           <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {price === 0 ? "FREE" : `$${price}`}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
           <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
             View Course
           </span>
           <span className="text-foreground group-hover:translate-x-1 transition-transform">
             &rarr;
           </span>
        </div>
      </div>
    </Link>
  );
}
