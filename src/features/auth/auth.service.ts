import apiClient, { setTokenInMemory } from "@/shared/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  AssignUserCommand,
  AssignUserResponse,
  RemoveUserTeamCommand,
  RemoveUserTeamResponse,
  UserDto,
  TeamDto,
  User,
  AuthResponse,
  RegisterResponse,
} from "./auth.types";
import { mapUserDtoToUser } from "./auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<AuthResponse>("/api/Auth/login", data);
    const token = response.data.accessToken;

    if (!token) {
      throw new Error("Không nhận được token từ server");
    }

    setTokenInMemory(token);

    const profileDto = await this.getProfile();
    const user = mapUserDtoToUser(profileDto);

    return {
      token,
      user,
    };
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>("/api/Auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    // JWT is stateless, just clear client-side token
  },

  async getProfile(): Promise<UserDto> {
    const response = await apiClient.get<UserDto>("/api/Auth/profile");
    return response.data;
  },

  async getUsers(): Promise<UserDto[]> {
    const response = await apiClient.get<UserDto[]>("/api/Auth/users");
    return response.data;
  },

  async getUserById(id: string): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`/api/Auth/users/${id}`);
    return response.data;
  },

  async getTeams(): Promise<TeamDto[]> {
    const response = await apiClient.get<TeamDto[]>("/api/Auth/teams");
    return response.data;
  },

  async assignUser(data: AssignUserCommand): Promise<AssignUserResponse> {
    const response = await apiClient.post<AssignUserResponse>("/api/Auth/assign-user", data);
    return response.data;
  },

  async removeUserTeam(data: RemoveUserTeamCommand): Promise<RemoveUserTeamResponse> {
    const response = await apiClient.post<RemoveUserTeamResponse>("/api/Auth/remove-team", data);
    return response.data;
  },

  // Backward compatibility wrapper
  async assignRole(data: AssignUserCommand): Promise<void> {
    await this.assignUser(data);
  },
};


