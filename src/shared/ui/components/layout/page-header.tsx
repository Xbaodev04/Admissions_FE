import * as React from "react";
import { cn } from "@/shared/utils/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-t-xl bg-[#154a7c] dark:bg-card dark:border dark:border-border px-8 py-8 text-white shadow-sm",
        className
      )}
    >
      {/* Decorative background overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <svg
          className="absolute right-0 top-0 h-full w-auto transform translate-x-1/3 -translate-y-1/4"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="currentColor" />
        </svg>
        <svg
          className="absolute right-1/4 bottom-0 h-full w-auto transform translate-x-1/2 translate-y-1/3"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-center">
        <h1 className="text-2xl font-bold tracking-tight mb-1 uppercase">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-white/80">{description}</p>
        )}
      </div>
    </div>
  );
}
