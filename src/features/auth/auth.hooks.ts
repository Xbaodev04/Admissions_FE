import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./auth.store";
import { authService } from "./auth.service";
import type { LoginFormData, RegisterFormData } from "./auth.schema";
import { UserRole, type User, mapUserDtoToUser } from "./auth.types";
import { useToast } from "@/shared/ui/components/shared/toast";

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

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const userDtos = await authService.getUsers();
      const mapped = userDtos.map(mapUserDtoToUser);
      setUsers(mapped);
    } catch {
      addToast({
        type: "error",
        title: "Lỗi tải danh sách người dùng",
        description: "Không thể kết nối tới máy chủ.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const assignUser = async (userId: string, role: UserRole, teamId?: string | null) => {
    try {
      const response = await authService.assignUser({ userId, role, teamId });
      addToast({
        type: "success",
        title: "Cập nhật quyền thành công",
        description: response.message || "Đã lưu thay đổi.",
      });
      await fetchUsers();
      return true;
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Cập nhật quyền thất bại",
        description: err.message || "Đã xảy ra lỗi.",
      });
      return false;
    }
  };

  return {
    users,
    isLoading,
    refresh: fetchUsers,
    assignUser,
  };
}

