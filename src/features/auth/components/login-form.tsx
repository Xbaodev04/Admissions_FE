"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";
import { loginSchema, type LoginFormInput, type LoginFormData } from "@/features/auth/auth.schema";
import { useLogin } from "@/features/auth/auth.hooks";

export function LoginForm() {
  const { login, isSubmitting } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      setError("email", { type: "manual", message: "Sai tài khoản hoặc mật khẩu" });
      setError("password", { type: "manual", message: "Sai tài khoản hoặc mật khẩu" });
    }
  };

  return (
    <div className="bg-white backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-8 pt-10 mt-12 relative w-full animate-slide-up">
      {/* Logo */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-[#e49b2b]/90 shadow-[0_0_20px_rgba(228,155,43,0.4)] overflow-hidden">
          <img src="/logo-cdtd.png" alt="Trường Cao Đẳng Tây Đô" className="h-full w-full object-contain bg-white" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mt-6 mb-8 space-y-1">
        <p className="text-sm text-black font-medium tracking-wide">Chào mừng bạn đến với</p>
        <p className="text-sm font-bold text-[#e49b2b] drop-shadow-[0_0_8px_rgba(228,155,43,0.6)]">Cao Đẳng Tây Đô</p>
        
        <h1 className="text-xl font-bold text-black flex items-center justify-center gap-2 mt-4 pt-2 drop-shadow-lg">
          <img src="/user-lock-solid.svg" alt="Login" className="h-6 w-6"/>
          ĐĂNG NHẬP
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <img src="/user-lock-solid.svg" alt="User" className="h-4 w-4"/>
            </div>
            <input
              id="email"
              type="text"
              aria-label="Tên đăng nhập hoặc Email"
              placeholder="Tên đăng nhập hoặc Email"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              autoComplete="username"
              {...register("email")}
            />
          </div>
          {errors.email?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <img src="/pass-lock-solid.svg" alt="Password" className="h-4 w-4"/>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="Mật khẩu"
              placeholder="Mật khẩu"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              autoComplete="current-password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-3 px-4 text-gray-500 hover:text-black focus:outline-none transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-1 pl-1 pr-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="text-xs text-black group-hover:text-blue-700 transition-colors">Ghi nhớ đăng nhập</span>
          </label>
          <Link href="/forgot-password" className="text-xs text-black hover:text-blue-700 font-medium transition-colors">
            Quên mật khẩu?
          </Link>
        </div>

        <div className="pt-4 pb-2 flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="w-full sm:w-1/2 rounded-[10px] text-[16px] shadow bg-blue-900 hover:bg-blue-700 text-white h-11 transition-colors"
            isLoading={isSubmitting}
          >
            Đăng nhập
          </Button>

          <p className="text-sm text-black">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-black font-semibold hover:text-blue-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
