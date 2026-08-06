// ============================================================
// Auth types — Mirrors backend Auth.Domain exactly
// ============================================================

export enum UserRole {
  User = 1,         // Người dùng (Tư vấn viên)
  Intern = 2,       // Thực tập sinh / Thử việc
  EntryClerk = 3,   // Nhập liệu
  Engineer = 4,     // Marketing
  Admin = 99,       // Quản trị viên
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.User]: "Người dùng",
  [UserRole.Intern]: "Thực tập sinh / Thử việc",
  [UserRole.EntryClerk]: "Nhập liệu",
  [UserRole.Engineer]: "Marketing",
  [UserRole.Admin]: "Quản trị viên",
};

export enum RoleTeam {
  Admission = "Nhóm tuyển sinh",
  Marketing = "Nhóm marketing",
  CustomerCare = "Nhóm chăm sóc khách hàng",
  Elementary = "Nhóm sơ cấp",
  Formal = "Nhóm chính quy",
  Driving = "Nhóm lái xe",
}

export const ROLE_TEAM_LABELS: Record<RoleTeam, string> = {
  [RoleTeam.Admission]: "Nhóm tuyển sinh",
  [RoleTeam.Marketing]: "Nhóm marketing",
  [RoleTeam.CustomerCare]: "Nhóm chăm sóc khách hàng",
  [RoleTeam.Elementary]: "Nhóm sơ cấp",
  [RoleTeam.Formal]: "Nhóm chính quy",
  [RoleTeam.Driving]: "Nhóm lái xe",
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string | null;
  roleTeam?: RoleTeam | null;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserDto {
  id: string;
  userName?: string | null;
  fullName?: string | null;
  mobile?: string | null;
  identificationNumber?: string | null;
  role: UserRole | number | string;
  teamId?: string | null;
  roleTeam?: RoleTeam | null;
  profilePicUrl?: string | null;
  isActived: boolean;
  userInternalId?: string | null;
}

export interface TeamDto {
  id: string;
  name: string;
  roleTeam: RoleTeam | null;
  isActive: boolean;
}

export interface AssignUserCommand {
  userId: string;
  role?: UserRole | null;
  teamId?: string | null;
}

export interface AssignUserResponse {
  message?: string | null;
}

export interface RemoveUserTeamCommand {
  userId: string;
}

export interface RemoveUserTeamResponse {
  message?: string | null;
}

export interface LoginCommand {
  userName?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  accessToken?: string | null;
}

export interface RegisterCommand {
  userName?: string | null;
  password?: string | null;
  fullName?: string | null;
  mobile?: string | null;
  identificationNumber?: string | null;
}

export interface RegisterResponse {
  message?: string | null;
}

export function normalizeRole(role: UserRole | number | string | null | undefined): UserRole {
  if (role == null) return UserRole.User;

  const numericRole = Number(role);
  if (!Number.isNaN(numericRole)) {
    return numericRole as UserRole;
  }

  const normalizedRole = String(role).trim().toLowerCase();

  switch (normalizedRole) {
    case "admin":
    case "administrator":
    case "quản trị viên":
      return UserRole.Admin;
    case "engineer":
    case "marketing":
      return UserRole.Engineer;
    case "entryclerk":
    case "entry_clerk":
    case "nhập liệu":
      return UserRole.EntryClerk;
    case "intern":
    case "thực tập sinh":
    case "thử việc":
      return UserRole.Intern;
    case "user":
    case "consultant":
    case "người dùng":
    case "tư vấn viên":
      return UserRole.User;
    default:
      return UserRole.User;
  }
}

// Keep older aliases for backward compatibility
export type LoginRequest = LoginCommand;
export type RegisterRequest = RegisterCommand & { confirmPassword?: string };
export type AssignRoleRequest = AssignUserCommand;
export type AuthResponse = LoginResponse;

export function mapUserDtoToUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.userName || "",
    name: dto.fullName || dto.userName || "User",
    role: normalizeRole(dto.role),
    teamId: dto.teamId,
    roleTeam: dto.roleTeam,
    avatar: dto.profilePicUrl || undefined,
    createdAt: new Date().toISOString(),
    isActive: dto.isActived,
  };
}

/**
 * Check if user role is Admin (only Admin=99 is considered elevated).
 * Note: Backend role hierarchy is NOT linear (1,2,3,4,99).
 * Roles 1-4 are regular users with different functions; 99 is admin.
 */
export function isAdmin(role: UserRole): boolean {
  return normalizeRole(role) === UserRole.Admin;
}

/** Backward compat: Admin can access admin features */
export function canAccessAdmin(role: UserRole): boolean {
  return normalizeRole(role) === UserRole.Admin;
}

/** Backward compat: only Admin can assign leads manually */
export function canAssignLeads(role: UserRole): boolean {
  return normalizeRole(role) === UserRole.Admin;
}

/** Only Admin can manage users */
export function canManageUsers(role: UserRole): boolean {
  return normalizeRole(role) === UserRole.Admin;
}

/** EntryClerk and Engineer can create leads (nhập liệu / marketing) */
export function canCreateLeads(role: UserRole): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === UserRole.EntryClerk || normalizedRole === UserRole.Engineer || normalizedRole === UserRole.Admin;
}

/** User role (consultants) can submit evidence */
export function canSubmitEvidence(role: UserRole): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === UserRole.User || normalizedRole === UserRole.Admin;
}

// Deprecated — kept for compatibility but no longer meaningful with non-linear role hierarchy
export function hasMinRole(_userRole: UserRole, _requiredRole: UserRole): boolean {
  return _userRole >= _requiredRole;
}
