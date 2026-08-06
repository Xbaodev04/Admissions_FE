"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/utils";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  canAccessAdmin,
  canManageUsers,
  canSubmitEvidence,
  normalizeRole,
  UserRole,
  RoleTeam,
} from "@/features/auth/auth.types";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Timer,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  History,
  FileCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiresRole?: "admin";
  allowedRoles?: UserRole[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, requiresRole: "admin" },
      { label: "Tiến độ cá nhân", href: "/reports/assignment", icon: LayoutDashboard },
    ],
  },
  {
    title: "Quản lý Lead",
    items: [
      { label: "Giao Lead & Hàng đợi", href: "/assignment", icon: UserPlus, requiresRole: "admin" },
    ],
  },
  {
    title: "Quản lý Assignment",
    items: [
      { label: "SLA", href: "/formal/sla", icon: Timer, requiresRole: "admin" },
      { label: "Lịch sử", href: "/formal/history", icon: History },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { label: "Quản lý người dùng", href: "/admin/users", icon: Users, requiresRole: "admin" },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings, requiresRole: "admin" },
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
  const userRole = normalizeRole(user?.role);

  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    navGroups.reduce((acc, group) => ({ ...acc, [group.title]: true }), {})
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filteredGroups = React.useMemo(() => {
    let groups = JSON.parse(JSON.stringify(navGroups)) as NavGroup[];
    
    groups.forEach((g, gIdx) => {
      g.items.forEach((item, iIdx) => {
        item.icon = navGroups[gIdx].items[iIdx].icon;
      });
    });

    if (user?.roleTeam === RoleTeam.Formal) {
      groups[0].items.push({
        label: "Bằng chứng liên hệ",
        href: "/evidence",
        icon: FileCheck
      });
      groups = groups.filter(g => g.title !== "Quản lý Lead" && g.title !== "Quản lý Assignment");
    }

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.allowedRoles && !item.allowedRoles.includes(userRole)) return false;
          if (!item.requiresRole) return true;

          if (item.requiresRole === "admin") return canManageUsers(userRole);
          if (item.requiresRole === "submitEvidence") return canSubmitEvidence(userRole) || user?.roleTeam === RoleTeam.Formal;

          return canAccessAdmin(userRole);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [user, userRole]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-sidebar border-r border-slate-200 dark:border-border transition-all duration-300 flex flex-col shadow-sm dark:shadow-none",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-border">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary dark:bg-cyan-500/20 flex items-center justify-center">
            <span className="text-primary-foreground dark:text-cyan-400 font-bold text-lg">TĐ</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-xs font-bold text-primary dark:text-cyan-400 uppercase whitespace-nowrap">
                Trường Cao Đẳng Tây Đô
              </h1>
              <p className="text-[9px] text-primary/80 dark:text-cyan-400/80 uppercase whitespace-nowrap">
                Thực học - Thực hành - Thực nghiệp
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {filteredGroups.map((group) => {
          const isExpanded = collapsed || expandedGroups[group.title];

          return (
            <div key={group.title}>
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      !isExpanded && "-rotate-90"
                    )}
                  />
                </button>
              )}

              <div
                className={cn(
                  "space-y-1 overflow-hidden transition-all duration-300",
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  let displayLabel = item.label;
                  if (item.href === "/reports/assignment" && canAccessAdmin(userRole)) {
                    displayLabel = "Báo cáo phân công";
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary dark:bg-cyan-500/10 text-primary-foreground dark:text-cyan-400 shadow-md dark:shadow-none shadow-primary/20 dark:border dark:border-cyan-500/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-slate-200",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? displayLabel : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 flex-shrink-0",
                          isActive && "text-white dark:text-cyan-400"
                        )}
                      />
                      {!collapsed && <span className="truncate">{displayLabel}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-lg py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyan-400 border border-transparent dark:hover:border-slate-700 transition-all shadow-sm dark:shadow-none"
          title={collapsed ? "Mở rộng" : "Thu gọn"}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Thu gọn</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}