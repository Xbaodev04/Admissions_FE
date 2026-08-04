import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Tên đăng nhập hoặc Email không được để trống"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống"),
})
.transform((data) => ({
  ...data,
  userName: data.email, // Map email to userName for LoginRequest
}));

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    mobile: z.string().min(10, "Số điện thoại không hợp lệ"),
    identificationNumber: z.string().min(9, "CCCD/CMND không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .transform((data) => ({
    ...data,
    userName: data.email, // Map email to userName for RegisterRequest
  }));

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
