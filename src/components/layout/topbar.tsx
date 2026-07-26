"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/types/auth";
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Topbar({ sidebarCollapsed, onMenuClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
        "fixed top-0 right-0 z-30 h-16 border-b border-navy-700/50 bg-background/80 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "left-[68px]" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Left: Menu button (mobile) + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-navy-400 hover:text-navy-200 transition-colors"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
            <input
              type="text"
              placeholder="Tìm kiếm lead, khách hàng..."
              className={cn(
                "w-full h-9 pl-10 pr-4 rounded-lg bg-navy-800/50 border text-sm text-navy-200 placeholder:text-navy-500 transition-all duration-200",
                searchFocused
                  ? "border-cyan-500/50 ring-2 ring-cyan-500/10"
                  : "border-navy-700/50"
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-navy-400 hover:bg-navy-800 hover:text-navy-200 transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
            >
              <Avatar name={user?.name || "User"} size="sm" />
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-medium text-navy-200 truncate max-w-[120px]">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-navy-500">
                  {user?.role ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-navy-500 hidden md:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-navy-700/50 bg-card shadow-xl shadow-black/20 py-1 animate-scale-in">
                <div className="px-4 py-3 border-b border-navy-700/50">
                  <p className="text-sm font-medium text-navy-200">
                    {user?.name}
                  </p>
                  <p className="text-xs text-navy-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-navy-800 transition-colors"
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
