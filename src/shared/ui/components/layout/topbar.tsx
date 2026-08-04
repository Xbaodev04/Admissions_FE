"use client";

import * as React from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { ROLE_LABELS, UserRole } from "@/features/auth/auth.types";
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { ThemeToggle } from "@/shared/ui/components/shared/theme-toggle";
import { assignmentService } from "@/features/assignments/assignment.service";
import { useToast } from "@/shared/ui/components/shared/toast";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Topbar({ sidebarCollapsed, onMenuClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { addToast } = useToast();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [isToggling, setIsToggling] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleStatus = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      if (isOnline) {
        await assignmentService.checkOut();
        setIsOnline(false);
        addToast({
          type: "info",
          title: "Đã tắt trạng thái nhận lead",
          description: "Bạn đã checkout thành công.",
        });
      } else {
        await assignmentService.checkIn();
        setIsOnline(true);
        addToast({
          type: "success",
          title: "Đã sẵn sàng nhận lead",
          description: "Bạn đã checkin thành công.",
        });
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Không thể cập nhật trạng thái",
        description: err.message || "Đã xảy ra lỗi.",
      });
    } finally {
      setIsToggling(false);
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-slate-200 dark:border-border bg-white/80 dark:bg-background/80 backdrop-blur-xl transition-all duration-300 shadow-sm dark:shadow-none",
        sidebarCollapsed ? "left-[68px]" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Left: Menu button (mobile) + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            className={cn(
              "relative max-w-md w-full transition-all duration-200",
              searchFocused && "max-w-lg"
            )}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm lead, khách hàng..."
              className={cn(
                "w-full h-9 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-900 border text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200",
                searchFocused
                  ? "border-[#154a7c]/50 dark:border-cyan-500/50 ring-2 ring-[#154a7c]/10 dark:ring-cyan-500/10"
                  : "border-slate-200 dark:border-slate-800"
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right: Status Toggle, Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Online Status Toggle (Consultant Only) */}
          {user?.role === UserRole.Consultant && (
            <button
              onClick={toggleStatus}
              disabled={isToggling}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer",
                isOnline
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20"
              )}
              title={isOnline ? "Bấm để tắt nhận Lead" : "Bấm để bật sẵn sàng nhận Lead"}
            >
              <div className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isOnline ? "bg-emerald-500" : "bg-slate-400"
                  )}
                ></span>
              </div>
              <span className="text-xs font-medium">
                {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
              </span>
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Avatar name={user?.name || "User"} size="sm" />
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user?.role ? ROLE_LABELS[user.role as UserRole] : ""}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 hidden md:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-black/5 py-1 animate-scale-in">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
