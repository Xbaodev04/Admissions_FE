import { AppShell } from "@/shared/ui/components/layout/app-shell";
import { AuthGuard } from "@/shared/ui/components/layout/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // AuthGuard kiểm tra xem user đã có token hay chưa, nếu chưa thì chuyển hướng sang trang /auth/login
    <AuthGuard>
    // AppShell hiển thị sidebar và header, nội dung truyền vào children *
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
