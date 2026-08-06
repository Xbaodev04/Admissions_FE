"use client";

import * as React from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { ROLE_LABELS, UserRole, canAccessAdmin } from "@/features/auth/auth.types";
import {
  Search,
  LogOut,
  ChevronDown,
  Menu,
  Loader2,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { ThemeToggle } from "@/shared/ui/components/shared/theme-toggle";
import { useToast } from "@/shared/ui/components/shared/toast";
import { ConfirmDialog } from "@/shared/ui/components/shared/confirm-dialog";
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
  const [confirmStatusModalOpen, setConfirmStatusModalOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Hook-based check-in status mapping to the backend queue
  const { isCheckedIn, isLoading: isQueueLoading } = useCheckInStatus();
  const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutateAsync: checkOut, isPending: isCheckingOut } = useCheckOut();

  const isToggling = isCheckingIn || isCheckingOut || isQueueLoading;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Ẩn nút Check-in đối với Admin, hiển thị hai chiều Check-in/Check-out đối với Nhân viên
  const canShowCheckInOut = React.useMemo(() => {
    if (!user) return false;
    if (canAccessAdmin(user.role)) return false;
    return true;
  }, [user]);

  const toggleStatus = async () => {
    if (isToggling) return;

    try {
      if (isCheckedIn) {
        try {
          await checkOut();
          addToast({
            type: "info",
            title: "Đã Check-out",
            description: "Bạn đã tắt trạng thái sẵn sàng nhận lead.",
          });
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "";
          if (msg.toLowerCase().includes("chưa check-in") || msg.toLowerCase().includes("not checked in")) {
            await checkIn();
            addToast({
              type: "success",
              title: "Đã Check-in",
              description: "Bạn đã sẵn sàng nhận lead.",
            });
          } else {
            throw err;
          }
        }
      } else {
        try {
          await checkIn();
          addToast({
            type: "success",
            title: "Đã Check-in",
            description: "Bạn đã sẵn sàng nhận lead.",
          });
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "";
          if (msg.toLowerCase().includes("đã check-in") || msg.toLowerCase().includes("already checked in")) {
            await checkOut();
            addToast({
              type: "info",
              title: "Đã Check-out",
              description: "Bạn đã tắt trạng thái sẵn sàng nhận lead.",
            });
          } else {
            throw err;
          }
        }
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

  const handleConfirmToggle = async () => {
    setConfirmStatusModalOpen(false);
    await toggleStatus();
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Tự động Check-out trước khi Đăng xuất nếu người dùng đang Check-in
      if (isCheckedIn) {
        try {
          await checkOut();
          addToast({
            type: "info",
            title: "Tự động Check-out",
            description: "Hệ thống đã tự động Check-out trước khi đăng xuất.",
          });
        } catch {
          // Bỏ qua lỗi checkOut khi logout nếu có
        }
      }
    } finally {
      clearAuth();
      window.location.href = "/login";
    }
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

        {/* Right: Status Toggle, Profile */}
        <div className="flex items-center gap-3">
          {/* Online Status / Check-in Check-out Toggle */}
          {canShowCheckInOut && (
            <button
              onClick={() => setConfirmStatusModalOpen(true)}
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
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Check-in / Check-out */}
      <ConfirmDialog
        open={confirmStatusModalOpen}
        onClose={() => setConfirmStatusModalOpen(false)}
        onConfirm={handleConfirmToggle}
        title={isCheckedIn ? "Xác nhận Check-out" : "Xác nhận Check-in"}
        description={
          isCheckedIn
            ? "Bạn có chắc chắn muốn Check-out? Trạng thái nhận lead tự động của bạn sẽ bị tắt."
            : "Bạn có chắc chắn muốn Check-in? Bạn sẽ bật trạng thái sẵn sàng tiếp nhận lead tự động từ hệ thống."
        }
        confirmLabel={isCheckedIn ? "Check-out ngay" : "Check-in ngay"}
        variant={isCheckedIn ? "warning" : "default"}
        isLoading={isToggling}
      />
    </header>
  );
}