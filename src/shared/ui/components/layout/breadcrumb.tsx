"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/shared/utils/utils";

const routeLabels: Record<string, string> = {
  leads: "Quản lý Lead",
  create: "Tạo mới",
  formal: "Chính quy",
  driving: "Lái xe",
  shortterm: "Ngắn hạn",
  assignment: "Giao việc",
  queue: "Hàng đợi (Queue)",
  sla: "Theo dõi SLA",
  evidence: "Bằng chứng (Evidence)",
  admin: "Quản trị hệ thống",
  users: "Người dùng",
  roles: "Phân quyền",
  settings: "Cài đặt",
};

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null; // Don't show on home/dashboard
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-sm mb-6", className)}
    >
      <Link
        href="/"
        className="flex items-center p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyan-400 transition-all duration-200"
        title="Trang chủ"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = routeLabels[segment] || segment;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
            {isLast ? (
              <span className="px-2 py-1 bg-primary/5 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 font-semibold rounded-md capitalize truncate max-w-[200px] border border-primary/10 dark:border-cyan-500/20 shadow-sm dark:shadow-none">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="px-1.5 py-1 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors font-medium capitalize truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
