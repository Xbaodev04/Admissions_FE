// ============================================================
// Auth types
// ============================================================

export type Role = "admin" | "manager" | "consultant";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  consultant: "Tư vấn viên",
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  email?: string;
  userName?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface BackendAuthResponse {
  accessToken: string;
  fullName: string;
  role: number | string;
}

export interface RegisterRequest {
  name?: string;
  fullName?: string;
  email?: string;
  userName?: string;
  password: string;
  confirmPassword?: string;
  mobile?: string;
  identificationNumber?: string;
  role?: Role | number;
}

export interface AssignRoleRequest {
  userId: string;
  role: Role | number;
  teamId?: string;
}

// ============================================================
// Permission helpers
// ============================================================

const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 3,
  manager: 2,
  consultant: 1,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessAdmin(role: Role): boolean {
  return hasMinRole(role, "manager");
}

export function canAssignLeads(role: Role): boolean {
  return hasMinRole(role, "manager");
}

export function canManageUsers(role: Role): boolean {
  return role === "admin";
}
