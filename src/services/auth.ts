import apiClient, { setTokenInMemory, clearTokenFromMemory } from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AssignRoleRequest,
  User,
  Role,
  BackendAuthResponse,
} from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const payload = {
      userName: data.userName || data.email || "",
      password: data.password,
    };
    const response = await apiClient.post<BackendAuthResponse>(
      "/api/auth/login",
      payload
    );
    const result = response.data;
    // Store token in memory for subsequent requests
    setTokenInMemory(result.accessToken);

    let roleStr: Role = "consultant";
    if (typeof result.role === "number") {
      if (result.role === 99) roleStr = "admin";
      else if (result.role === 2 || result.role === 3) roleStr = "manager";
    } else if (typeof result.role === "string") {
      const lower = result.role.toLowerCase();
      if (lower.includes("admin")) roleStr = "admin";
      else if (lower.includes("manager")) roleStr = "manager";
    }

    const user: User = {
      id: "current-user-id",
      email: data.email || data.userName || "",
      name: result.fullName || "User",
      role: roleStr,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    return {
      token: result.accessToken,
      user,
    };
  },

  async register(
    data: Omit<RegisterRequest, "confirmPassword">
  ): Promise<{ message: string }> {
    const payload = {
      userName: data.userName || data.email || "",
      password: data.password,
      fullName: data.fullName || data.name || "",
      mobile: data.mobile || "",
      identificationNumber: data.identificationNumber || "",
      role: data.role || 1, // Default User role in Backend
    };
    const response = await apiClient.post<{ message: string }>(
      "/api/auth/register",
      payload
    );
    return response.data;
  },

  async assignRole(data: AssignRoleRequest): Promise<void> {
    await apiClient.post("/api/auth/assign-role", {
      userId: data.userId,
      role: data.role,
      teamId: data.teamId,
    });
  },

  logout(): void {
    clearTokenFromMemory();
    // Clear any client-side state and redirect
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
