"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/components/shared/toast";
import { FileCheck, Mail, Lock } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@crm.edu.vn",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const result = await authService.login(data);
      // setAuth(result.user, result.token);

      // Mock login: match by email
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser = mockUsers.find(
        (u) => u.email === data.email
      );

      if (!mockUser) {
        addToast({
          type: "error",
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không đúng.",
        });
        setIsSubmitting(false);
        return;
      }

      const mockToken = `mock-jwt-${mockUser.id}-${Date.now()}`;
      setAuth(mockUser, mockToken);
      addToast({
        type: "success",
        title: "Đăng nhập thành công",
        description: `Chào mừng ${mockUser.name}!`,
      });
      router.push("/");
    } catch {
      addToast({
        type: "error",
        title: "Đăng nhập thất bại",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-accent mb-4 shadow-lg shadow-cyan-500/20">
          <FileCheck className="h-7 w-7 text-navy-950" />
        </div>
        <h1 className="text-2xl font-bold text-navy-100">CRM Tuyển Sinh</h1>
        <p className="text-sm text-navy-400 mt-1">
          Đăng nhập để tiếp tục
        </p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                id="email"
                type="email"
                placeholder="admin@crm.edu.vn"
                className="pl-10"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required>
              Mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>

        {/* Demo accounts hint */}
        <div className="mt-6 p-3 rounded-lg bg-navy-800/50 border border-navy-700/50">
          <p className="text-xs text-navy-400 font-medium mb-2">
            🔑 Tài khoản demo:
          </p>
          <div className="space-y-1 text-xs text-navy-500">
            <p>
              <span className="text-cyan-400">Admin:</span> admin@crm.edu.vn
            </p>
            <p>
              <span className="text-amber-400">Manager:</span>{" "}
              manager@crm.edu.vn
            </p>
            <p>
              <span className="text-emerald-400">Consultant:</span>{" "}
              consultant1@crm.edu.vn
            </p>
            <p className="text-navy-600 mt-1">Mật khẩu: bất kỳ</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-navy-500 mt-6">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
