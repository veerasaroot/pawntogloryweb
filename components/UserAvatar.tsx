"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

function getInitials(name: string | null | undefined): string {
  if (!name || name.trim().length === 0) {
    return "U";
  }
  const trimmed = name.trim();
  if (trimmed.length === 1) {
    return trimmed.toUpperCase();
  }
  // Get first and last character of the name
  const firstChar = trimmed.charAt(0).toUpperCase();
  const lastChar = trimmed.charAt(trimmed.length - 1).toUpperCase();
  return `${firstChar}${lastChar}`;
}

function getColorFromName(name: string | null | undefined): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  if (!name) return colors[0];

  // Generate a consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  if (avatarUrl) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden shrink-0",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={avatarUrl}
          alt={name || "User avatar"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-bold shrink-0",
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      {initials}
    </div>
  );
}
