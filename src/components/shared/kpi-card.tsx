"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "cyan" | "emerald" | "amber" | "rose";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-navy-700",
    iconColor: "text-navy-300",
    glowColor: "",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/5",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/5",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    glowColor: "shadow-amber-500/5",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    glowColor: "shadow-rose-500/5",
  },
};

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
  className,
}: KpiCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-navy-700/50 bg-card p-5 shadow-lg hover-lift",
        styles.glowColor,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-navy-400">{title}</p>
          <p className="text-3xl font-bold text-navy-100 tracking-tight">
            {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-navy-500">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
