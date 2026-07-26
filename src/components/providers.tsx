"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/shared/toast";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
