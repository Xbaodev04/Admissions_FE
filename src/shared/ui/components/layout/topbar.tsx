"use client";

import * as React from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { ROLE_LABELS, UserRole, RoleTeam } from "@/features/auth/auth.types";
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { ThemeToggle } from "@/shared/ui/components/shared/theme-toggle";
import { useToast } from "@/shared/ui/components/shared/toast";
import { useCheckInStatus } from "@/features/assignments/useCheckInStatus";
import { useCheckIn, useCheckOut } from "@/features/assignments/assignment.hooks";

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

  // Hook-based check-in status mapping to the backend queue
  const { isCheckedIn, isLoading: isQueueLoading } = useCheckInStatus();
  const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutateAsync: checkOut, isPending: isCheckingOut } = useCheckOut();

  const isToggling = isCheckingIn || isCheckingOut || isQueueLoading;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Kiểm tra điều kiện hiển thị nút Check-in/Out cho Elementary (4), Formal (5), hoặc Driving (6)
  const canShowCheckInOut = React.useMemo(() => {
    if (!user) return false;

    const userTeam = user.roleTeam ? String(user.roleTeam).toLowerCase() : "";
    const isElementary = userTeam === "nhóm sơ cấp" || userTeam === "elementary" || userTeam === "4";
    const isFormal = userTeam === "nhóm chính quy" || userTeam === "formal" || userTeam === "5";
    const isDriving = userTeam === "nhóm lái xe" || userTeam === "driving" || userTeam === "6";

    return isElementary || isFormal || isDriving;
  }, [user]);

  const toggleStatus = async () => {
    if (isToggling) return;

    const actionText = isCheckedIn
      ? "Check-out (Tắt trạng thái nhận lead)"
      : "Check-in (Bật trạng thái nhận lead)";

    const confirmChange = window.confirm(`Bạn có chắc chắn muốn thực hiện ${actionText}?`);
    if (!confirmChange) return;

    try {
      if (isCheckedIn) {
        await checkOut();
        addToast({
          type: "info",
          title: "Đã check-out",
          description: "Bạn đã tắt trạng thái sẵn sàng nhận lead.",
        });
      } else {
        await checkIn();
        addToast({
          type: "success",
          title: "Đã check-in",
          description: "Bạn đã sẵn sàng nhận lead.",
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "";
      addToast({
        type: "error",
        title: "Không thể cập nhật trạng thái",
        description: errorMessage || "Đã xảy ra lỗi.",
      });
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
          {/* Online Status / Check-in Check-out Toggle */}
          {canShowCheckInOut && (
            <button
              onClick={toggleStatus}
              disabled={isToggling}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer disabled:opacity-50",
                isCheckedIn
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20"
              )}
              title={
                isCheckedIn
                  ? "Bạn đang Check-in. Bấm để Check-out"
                  : "Bạn đang Check-out. Bấm để Check-in"
              }
            >
              <div className="relative flex h-2 w-2">
                {isCheckedIn && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isCheckedIn ? "bg-emerald-500" : "bg-slate-400"
                  )}
                ></span>
              </div>
              <span className="text-xs font-medium">
                {isCheckedIn ? "Trực tuyến (Bấm để Check-out)" : "Ngoại tuyến (Bấm để Check-in)"}
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