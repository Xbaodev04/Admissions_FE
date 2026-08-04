"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/shared/utils/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative p-2 rounded-lg text-navy-400 hover:bg-navy-800 hover:text-navy-200 transition-colors opacity-0",
          className
        )}
        aria-label="Đổi giao diện"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative p-2 rounded-lg text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-800 transition-colors",
        className
      )}
      aria-label="Đổi giao diện"
      title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
