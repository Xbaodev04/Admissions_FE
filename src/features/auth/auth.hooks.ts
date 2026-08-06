import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./auth.store";
import { authService } from "./auth.service";
import type { LoginFormData, RegisterFormData } from "./auth.schema";
import { type User, type UserDto, type TeamDto, mapUserDtoToUser } from "./auth.types";
import { useToast } from "@/shared/ui/components/shared/toast";

// ============================================================
// Query Keys
// ============================================================
export const authKeys = {
  all: ["auth"] as const,
  users: () => [...authKeys.all, "users"] as const,
  teams: () => [...authKeys.all, "teams"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// ============================================================
// Login (manual mutation — sets auth state)
// ============================================================
export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await authService.login({
        userName: data.userName,
        password: data.password,
      });
      setAuth(result.user, result.token);

      addToast({
        type: "success",
        title: "Đăng nhập thành công",
        description: `Chào mừng ${result.user.name}!`,
      });
      router.push("/");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    isSubmitting,
  };
}

// ============================================================
// Register (manual mutation)
// ============================================================
export function useRegister() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await authService.register({
        userName: data.userName,
        password: data.password,
        fullName: data.fullName,
        mobile: data.mobile,
        identificationNumber: data.identificationNumber,
      });
      addToast({
        type: "success",
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục.",
      });
      router.push("/login");
    } catch {
      addToast({
        type: "error",
        title: "Đăng ký thất bại",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerAccount: register,
    isSubmitting,
  };
}

// ============================================================
// Users (React Query)
// ============================================================
export function useUsers() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: userDtos = [], isLoading } = useQuery<UserDto[]>({
    queryKey: authKeys.users(),
    queryFn: () => authService.getUsers(),
  });

  const users: User[] = userDtos.map(mapUserDtoToUser);

  const assignUserMutation = useMutation({
    mutationFn: (params: { userId: string; role?: number | null; teamId?: string | null }) =>
      authService.assignUser(params),
    onSuccess: (response) => {
      addToast({
        type: "success",
        title: "Cập nhật quyền thành công",
        description: response.message || "Đã lưu thay đổi.",
      });
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Cập nhật quyền thất bại",
        description: err.message || "Đã xảy ra lỗi.",
      });
    },
  });

  const removeTeamMutation = useMutation({
    mutationFn: (userId: string) =>
      authService.removeUserTeam({ userId }),
    onSuccess: (response) => {
      addToast({
        type: "success",
        title: "Gỡ nhóm thành công",
        description: response.message || "Người dùng đã được gỡ khỏi nhóm.",
      });
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Gỡ nhóm thất bại",
        description: err.message || "Đã xảy ra lỗi.",
      });
    },
  });

  const assignUser = async (userId: string, role?: number | null, teamId?: string | null) => {
    try {
      await assignUserMutation.mutateAsync({ userId, role, teamId });
      return true;
    } catch {
      return false;
    }
  };

  const removeUserTeam = async (userId: string) => {
    try {
      await removeTeamMutation.mutateAsync(userId);
      return true;
    } catch {
      return false;
    }
  };

  return {
    users,
    userDtos,
    isLoading,
    refresh: () => queryClient.invalidateQueries({ queryKey: authKeys.users() }),
    assignUser,
    removeUserTeam,
  };
}

// ============================================================
// Teams (React Query)
// ============================================================
export function useTeams() {
  const { data: teams = [], isLoading } = useQuery<TeamDto[]>({
    queryKey: authKeys.teams(),
    queryFn: () => authService.getTeams(),
  });

  return {
    teams,
    isLoading,
  };
}


