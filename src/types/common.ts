// ============================================================
// Common API response types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// Branch types
// ============================================================

export type Branch = "formal" | "driving" | "shortterm";

export const BRANCH_LABELS: Record<Branch, string> = {
  formal: "Chính quy",
  driving: "Lái xe",
  shortterm: "Ngắn hạn",
};

export const BRANCH_COLORS: Record<Branch, string> = {
  formal: "cyan",
  driving: "amber",
  shortterm: "emerald",
};

// ============================================================
// Status types
// ============================================================

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export type SlaStatus = "on_track" | "at_risk" | "overdue" | "completed";

export type AssignmentStatus = "pending" | "active" | "completed" | "expired";

export const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }
> = {
  new: { label: "Mới", variant: "default" },
  contacted: { label: "Đã liên hệ", variant: "secondary" },
  qualified: { label: "Đủ điều kiện", variant: "success" },
  converted: { label: "Đã chuyển đổi", variant: "success" },
  lost: { label: "Mất", variant: "destructive" },
  on_track: { label: "Đúng tiến độ", variant: "success" },
  at_risk: { label: "Có rủi ro", variant: "warning" },
  overdue: { label: "Quá hạn", variant: "destructive" },
  completed: { label: "Hoàn thành", variant: "success" },
  pending: { label: "Chờ xử lý", variant: "default" },
  active: { label: "Đang hoạt động", variant: "success" },
  expired: { label: "Hết hạn", variant: "destructive" },
};
