import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/ui/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CRM Tuyển Sinh | Hệ thống quản lý tuyển sinh",
    template: "%s | CRM Tuyển Sinh",
  },
  description:
    "Hệ thống CRM quản lý tuyển sinh đa nhánh - Chính quy, Lái xe, Ngắn hạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
