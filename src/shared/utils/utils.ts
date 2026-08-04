import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mask sensitive PII data for display
 * Shows only last 4 characters for phone numbers, emails partially masked
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return "***";
  return `***-***-${phone.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email) return "***";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const maskedLocal =
    local.length > 2
      ? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
      : `${local[0]}*`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
