"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function Avatar({ src, alt, name, size = "md", className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;
  const initials = name ? getInitials(name) : "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-navy-700 text-navy-300 font-medium overflow-hidden flex-shrink-0",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showFallback ? (
        <span>{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

export { Avatar };
