"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { ToastProvider } from "@/shared/ui/components/shared/toast";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
