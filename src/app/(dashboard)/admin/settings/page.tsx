"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Label } from "@/shared/ui/components/ui/label";
import { useToast } from "@/shared/ui/components/shared/toast";
import { assignmentService } from "@/features/assignments/assignment.service";
import { authService } from "@/features/auth/auth.service";
import { UserRole, canAccessAdmin } from "@/features/auth/auth.types";
import type { UserDto } from "@/features/auth/auth.types";
import { Settings, Shield, Clock, UserCheck, Database, Loader2 } from "lucide-react";
import { useSeedCustomers } from "@/features/customers/customer.hooks";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/shared/ui/components/ui/dialog";

export default function SettingsPage() {
  const { addToast } = useToast();
  const user = useAuthStore((s) => s.user);
  
  const [managers, setManagers] = useState<UserDto[]>([]);
  const [slaDeadline, setSlaDeadline] = useState<number | "">("");
  const [defaultManagerId, setDefaultManagerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [seedCount, setSeedCount] = useState<number | "">(100);
  const [showConfirmSeed, setShowConfirmSeed] = useState(false);
  const seedMutation = useSeedCustomers();

  const isAdminUser = user ? canAccessAdmin(user.role) : false;

  useEffect(() => {
    const loadManagers = async () => {
      setIsLoading(true);
      try {
        const usersList = await authService.getUsers();
        // Filters admins (role 99)
        const filtered = usersList.filter(
          (u) => u.role === UserRole.Admin
        );
        setManagers(filtered);
      } catch (error: any) {
        addToast({
          type: "error",
          title: "Lỗi tải danh sách quản lý",
          description: error.message || "Không thể lấy thông tin người dùng từ máy chủ.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadManagers();
  }, [addToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await assignmentService.updateSlaConfig({
        slaDeadlineMinutes: slaDeadline === "" ? null : Number(slaDeadline),
        defaultManagerId: defaultManagerId || null,
      });
      addToast({
        type: "success",
        title: "Cập nhật thành công",
        description: "Cấu hình SLA và quản lý mặc định đã được lưu.",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Cập nhật thất bại",
        description: error.message || "Đã xảy ra lỗi khi lưu cấu hình.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleSeedData = async () => {
    const countVal = seedCount === "" ? 100 : Number(seedCount);
    try {
      await seedMutation.mutateAsync(countVal);
      addToast({
        type: "success",
        title: "Tạo dữ liệu thành công",
        description: `Đã tạo thành công ${countVal} khách hàng mẫu.`,
      });
      setShowConfirmSeed(false);
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Tạo dữ liệu thất bại",
        description: error.message || "Đã xảy ra lỗi khi tạo dữ liệu mẫu.",
      });
    }
  };
  return (
    <div className="animate-fade-in relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="text-sm font-medium text-navy-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          Cấu hình phân bổ & SLA
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Quản lý thời hạn phản hồi khách hàng (SLA) và người nhận mặc định khi thu hồi hoặc phân bổ thất bại.
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave}>
          <Card className="border border-navy-700/30 bg-navy-800/20 backdrop-blur-md">
            <CardHeader className="border-b border-navy-700/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-navy-100">
                <Shield className="h-4 w-4 text-amber-500 animate-pulse" />
                Cấu hình SLA & Phân bổ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* SLA Deadline input */}
              <div className="space-y-2">
                <Label htmlFor="slaDeadline" className="flex items-center gap-1.5 text-navy-200 font-medium">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Thời hạn SLA (phút)
                </Label>
                <Input
                  id="slaDeadline"
                  type="number"
                  min={1}
                  placeholder="Ví dụ: 60"
                  value={slaDeadline}
                  onChange={(e) => setSlaDeadline(e.target.value === "" ? "" : Number(e.target.value))}
                  className="bg-navy-900/50 border-navy-700/50 text-navy-100 focus:border-cyan-500/50"
                  required
                />
                <p className="text-xs text-navy-500">
                  Thời gian tối đa tư vấn viên phải liên hệ với khách hàng trước khi bị tính là vi phạm SLA.
                </p>
              </div>

              {/* Default Manager dropdown */}
              <div className="space-y-2">
                <Label htmlFor="defaultManager" className="flex items-center gap-1.5 text-navy-200 font-medium">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  Quản lý nhận Lead mặc định
                </Label>
                <select
                  id="defaultManager"
                  className="w-full h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={defaultManagerId}
                  onChange={(e) => setDefaultManagerId(e.target.value)}
                  required
                >
                  <option value="" className="bg-navy-900 text-navy-400">
                    -- Chọn quản lý nhận Lead --
                  </option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id} className="bg-navy-950 text-navy-100">
                      {m.fullName || m.userName} ({m.role === UserRole.Admin ? "Admin" : "Manager"})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-navy-500">
                  Người quản lý sẽ nhận các Lead bị thu hồi hoặc các Lead chưa được phân bổ tự động thành công.
                </p>
              </div>

               {/* Submit button */}
              <div className="pt-4 border-t border-navy-700/30 flex flex-col items-end gap-2">
                <p className="text-sm font-semibold text-rose-500">
                  ⚠️ Tính năng Cấu hình SLA hiện chưa sẵn sàng do backend chưa hỗ trợ API.
                </p>
                <Button 
                  type="submit" 
                  disabled={true}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-600/20 opacity-50 cursor-not-allowed"
                >
                  API chưa sẵn sàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      {isAdminUser && (
        <div className="max-w-2xl mt-8 animate-fade-in">
          <Card className="border border-navy-700/30 bg-navy-800/20 backdrop-blur-md">
            <CardHeader className="border-b border-navy-700/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-navy-100">
                <Database className="h-4 w-4 text-cyan-400" />
                Tạo dữ liệu mẫu tự động (Seed Data)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="seedCount" className="text-navy-200 font-medium">
                  Số lượng khách hàng cần tạo
                </Label>
                <Input
                  id="seedCount"
                  type="number"
                  min={1}
                  max={500}
                  placeholder="Mặc định: 100"
                  value={seedCount}
                  onChange={(e) => setSeedCount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="bg-navy-900/50 border-navy-700/50 text-navy-100 focus:border-cyan-500/50"
                />
                <p className="text-xs text-navy-500">
                  Hệ thống sẽ tự động sinh ngẫu nhiên thông tin khách hàng, số điện thoại, và tự động đẩy sự kiện phân bổ (Lead Assignment) tương ứng.
                </p>
              </div>

              <div className="pt-4 border-t border-navy-700/30 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowConfirmSeed(true)}
                  disabled={seedMutation.isPending}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-600/20"
                >
                  Bắt đầu Seed Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={showConfirmSeed} onClose={() => setShowConfirmSeed(false)}>
            <DialogClose onClose={() => setShowConfirmSeed(false)} />
            <DialogHeader>
              <DialogTitle className="text-navy-100 flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-500" />
                Xác nhận tạo dữ liệu mẫu
              </DialogTitle>
              <DialogDescription className="text-navy-300">
                Thao tác này sẽ tạo <strong>{seedCount || 100}</strong> khách hàng mẫu và tự động giao cho nhân viên đã check-in. Bạn có chắc chắn muốn thực hiện?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmSeed(false)}
                disabled={seedMutation.isPending}
                className="bg-navy-900 hover:bg-navy-800 text-navy-100 border-navy-700"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSeedData}
                disabled={seedMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-600/20"
              >
                {seedMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tạo dữ liệu mẫu...
                  </>
                ) : (
                  "Xác nhận tạo"
                )}
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      )}
    </div>
  );
}
