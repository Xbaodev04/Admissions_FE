"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth.store";
import { UserRole, hasMinRole } from "@/features/auth/auth.types";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && user) {
      if (!hasMinRole(user.role, requiredRole)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, requiredRole, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-sm text-navy-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user && !hasMinRole(user.role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
