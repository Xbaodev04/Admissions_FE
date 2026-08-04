"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/components/ui/button";
import { User, Lock, Eye, EyeOff, Phone, CreditCard } from "lucide-react";
import { registerSchema, type RegisterFormInput } from "@/features/auth/auth.schema";
import { useRegister } from "@/features/auth/auth.hooks";

export function RegisterForm() {
  const { registerAccount, isSubmitting } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

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
          <User className="h-6 w-6 text-black drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
          ĐĂNG KÝ
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(registerAccount as any)} className="space-y-5">
        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <User className="h-4 w-4" />
            </div>
            <input
              id="fullName"
              type="text"
              aria-label="Họ tên"
              placeholder="Họ tên (Nguyễn Văn A)"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              {...register("fullName")}
            />
          </div>
          {errors.fullName?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <User className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="text"
              aria-label="Email"
              placeholder="Email"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              {...register("email")}
            />
          </div>
          {errors.email?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="mobile"
              type="tel"
              aria-label="Số điện thoại"
              placeholder="Số điện thoại"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              {...register("mobile")}
            />
          </div>
          {errors.mobile?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.mobile.message}</p>}
        </div>

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <CreditCard className="h-4 w-4" />
            </div>
            <input
              id="identificationNumber"
              type="text"
              aria-label="CCCD/CMND"
              placeholder="CCCD/CMND"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              {...register("identificationNumber")}
            />
          </div>
          {errors.identificationNumber?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.identificationNumber.message}</p>}
        </div>

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="Mật khẩu"
              placeholder="Mật khẩu"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              autoComplete="new-password"
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

        <div>
          <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
            <div className="p-3 px-4 border-r border-white/10 text-black">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              aria-label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              className="flex-1 p-3 px-4 outline-none text-sm text-black bg-transparent placeholder-gray-400"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-3 px-4 text-gray-500 hover:text-black focus:outline-none transition-colors"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword?.message && <p className="text-xs text-rose-400 mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-4 pb-2 flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="w-full sm:w-1/2 rounded-[10px] text-[16px] shadow bg-blue-900 hover:bg-blue-700 text-white h-11 transition-colors"
            isLoading={isSubmitting}
          >
            Đăng ký
          </Button>

          <p className="text-sm text-black">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-black font-semibold hover:text-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
