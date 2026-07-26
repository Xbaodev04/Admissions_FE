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
import { useToast } from "@/components/shared/toast";
import { FileCheck, User, Mail, Lock } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (_data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // await authService.register(data);
      await new Promise((resolve) => setTimeout(resolve, 800));
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

  return (
    <div className="animate-slide-up">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-accent mb-4 shadow-lg shadow-cyan-500/20">
          <FileCheck className="h-7 w-7 text-navy-950" />
        </div>
        <h1 className="text-2xl font-bold text-navy-100">Tạo tài khoản</h1>
        <p className="text-sm text-navy-400 mt-1">
          Đăng ký để sử dụng hệ thống CRM
        </p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Họ tên
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                className="pl-10"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
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
                placeholder="Tối thiểu 8 ký tự"
                className="pl-10"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>
              Xác nhận mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="pl-10"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Đăng ký
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-navy-500 mt-6">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
