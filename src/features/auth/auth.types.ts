export enum UserRole {
  Consultant = 1, 
  Manager = 2,    
  Role3 = 3,
  Role4 = 4,
  Admin = 99,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Consultant]: "Tư vấn viên",
  [UserRole.Manager]: "Quản lý",
  [UserRole.Role3]: "Marketing / Nhập liệu",
  [UserRole.Role4]: "Vai trò 4",
  [UserRole.Admin]: "Quản trị viên",
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; 
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
  role: UserRole;
  teamId?: string | null;
  profilePicUrl?: string | null;
  isActived: boolean;
  userInternalId?: string | null;
}

export interface AssignUserCommand {
  userId: string;
  role: UserRole;
  teamId?: string | null;
}

export interface AssignUserResponse {
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
    role: dto.role,
    avatar: dto.profilePicUrl || undefined,
    createdAt: new Date().toISOString(),
    isActive: dto.isActived,
  };
}

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole >= requiredRole; 
}

export function canAccessAdmin(role: UserRole): boolean {
  return hasMinRole(role, UserRole.Manager);
}

export function canAssignLeads(role: UserRole): boolean {
  return hasMinRole(role, UserRole.Manager);
}

export function canManageUsers(role: UserRole): boolean {
  return role === UserRole.Admin;
}