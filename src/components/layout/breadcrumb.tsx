"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn("flex items-center space-x-1 text-sm text-navy-400 mb-4", className)}
    >
      <Link
        href="/"
        className="flex items-center hover:text-cyan-400 transition-colors"
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
            <ChevronRight className="h-3.5 w-3.5 text-navy-600 flex-shrink-0" />
            {isLast ? (
              <span className="font-medium text-navy-200 capitalize truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-cyan-400 transition-colors capitalize truncate max-w-[150px]"
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
