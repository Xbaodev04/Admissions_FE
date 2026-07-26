"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { canAccessAdmin, canManageUsers } from "@/types/auth";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  Timer,
  FileCheck,
  Upload,
  Settings,
  Shield,
  GraduationCap,
  Car,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiresRole?: "manager" | "admin";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Quản lý Lead",
    items: [
      { label: "Tạo Lead Chính quy", href: "/leads/create/formal", icon: GraduationCap },
      { label: "Tạo Lead Lái xe", href: "/leads/create/driving", icon: Car },
      { label: "Tạo Lead Ngắn hạn", href: "/leads/create/shortterm", icon: BookOpen },
      { label: "Giao Lead", href: "/assignment", icon: UserPlus, requiresRole: "manager" },
    ],
  },
  {
    title: "Chính quy",
    items: [
      { label: "Queue", href: "/formal/queue", icon: ClipboardList, requiresRole: "manager" },
      { label: "SLA", href: "/formal/sla", icon: Timer, requiresRole: "manager" },
      { label: "Lịch sử", href: "/formal/history", icon: History },
      { label: "Evidence", href: "/evidence", icon: Upload },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { label: "Người dùng", href: "/admin/users", icon: Users, requiresRole: "admin" },
      { label: "Phân quyền", href: "/admin/roles", icon: Shield, requiresRole: "admin" },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings, requiresRole: "manager" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role || "consultant";

  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.requiresRole) return true;
        if (item.requiresRole === "admin") return canManageUsers(userRole);
        return canAccessAdmin(userRole);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-sidebar border-r border-navy-700/50 transition-all duration-300 flex flex-col",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-navy-700/50">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-accent flex items-center justify-center">
            <FileCheck className="h-5 w-5 text-navy-950" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-navy-100 truncate">CRM Tuyển Sinh</h1>
              <p className="text-[10px] text-navy-500 truncate">Admissions Management</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-navy-500">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-navy-400 hover:bg-navy-800 hover:text-navy-200",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("h-4.5 w-4.5 flex-shrink-0", isActive && "text-cyan-400")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-navy-700/50 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-lg py-2 text-navy-400 hover:bg-navy-800 hover:text-navy-200 transition-colors"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Thu gọn</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
