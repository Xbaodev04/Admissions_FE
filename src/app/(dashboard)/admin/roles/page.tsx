"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/toast";
import { ROLE_LABELS, type Role } from "@/types/auth";
import { Shield, Check, X, Lock, Save } from "lucide-react";

interface Permission {
  id: string;
  module: string;
  name: string;
  description: string;
  defaultRoles: Role[];
}

const PERMISSIONS_LIST: Permission[] = [
  {
    id: "lead_view_all",
    module: "Quản lý Lead",
    name: "Xem tất cả Lead",
    description: "Cho phép xem danh sách lead của toàn bộ hệ thống hoặc chi nhánh",
    defaultRoles: ["admin", "manager"],
  },
  {
    id: "lead_create",
    module: "Quản lý Lead",
    name: "Tạo mới Lead",
    description: "Cho phép tạo mới khách hàng tiềm năng trên các nhánh",
    defaultRoles: ["admin", "manager", "consultant"],
  },
  {
    id: "lead_assign",
    module: "Quản lý Lead",
    name: "Giao / Phân bổ Lead",
    description: "Giao việc và luân chuyển lead giữa các tư vấn viên",
    defaultRoles: ["admin", "manager"],
  },
  {
    id: "sla_manage",
    module: "Chính quy & SLA",
    name: "Quản lý SLA & Queue",
    description: "Theo dõi tiến độ, cấu hình cảnh báo và gia hạn SLA",
    defaultRoles: ["admin", "manager"],
  },
  {
    id: "evidence_upload",
    module: "Evidence",
    name: "Tải lên bằng chứng",
    description: "Ghi nhận lịch sử gọi điện, gửi email và minh chứng liên hệ",
    defaultRoles: ["admin", "manager", "consultant"],
  },
  {
    id: "evidence_verify",
    module: "Evidence",
    name: "Duyệt bằng chứng",
    description: "Xác thực tính hợp lệ của các bằng chứng do tư vấn viên nộp",
    defaultRoles: ["admin", "manager"],
  },
  {
    id: "user_manage",
    module: "Hệ thống",
    name: "Quản lý người dùng",
    description: "Thêm, sửa, khóa tài khoản và phân vai trò người dùng",
    defaultRoles: ["admin"],
  },
  {
    id: "sys_settings",
    module: "Hệ thống",
    name: "Cấu hình hệ thống",
    description: "Thay đổi tham số API, thông báo và thông tin chung",
    defaultRoles: ["admin", "manager"],
  },
];

export default function RolesPage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<Record<string, Role[]>>(() => {
    const initial: Record<string, Role[]> = {};
    PERMISSIONS_LIST.forEach((p) => {
      initial[p.id] = [...p.defaultRoles];
    });
    return initial;
  });

  const togglePermission = (permId: string, role: Role) => {
    // Prevent removing admin access for critical system management
    if (role === "admin" && (permId === "user_manage" || permId === "sys_settings")) {
      addToast({
        type: "warning",
        title: "Quyền mặc định",
        description: "Không thể thu hồi quyền hệ thống của Admin.",
      });
      return;
    }

    setRolePermissions((prev) => {
      const currentRoles = prev[permId] || [];
      const exists = currentRoles.includes(role);
      const updated = exists
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role];
      return { ...prev, [permId]: updated };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      addToast({
        type: "success",
        title: "Lưu phân quyền thành công",
        description: "Ma trận quyền hệ thống đã được cập nhật.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Lưu thất bại",
        description: "Đã xảy ra lỗi khi lưu ma trận quyền.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const roles: Role[] = ["admin", "manager", "consultant"];
  const modules = Array.from(new Set(PERMISSIONS_LIST.map((p) => p.module)));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Phân quyền hệ thống (RBAC Matrix)
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Quản lý quyền hạn chi tiết cho từng vai trò trong CRM
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      {/* Role summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role} className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-navy-100 uppercase tracking-wider">
                  {ROLE_LABELS[role]}
                </p>
                <p className="text-xs text-navy-400 mt-0.5">
                  Vai trò {role === "admin" ? "hệ thống tối cao" : role === "manager" ? "quản lý vận hành" : "tiếp nhận & xử lý"}
                </p>
              </div>
              <Badge variant={role === "admin" ? "cyan" : role === "manager" ? "warning" : "success"}>
                {role}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matrix Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/50 bg-navy-800/40">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-navy-300 uppercase tracking-wider min-w-[280px]">
                    Quyền hạn / Chức năng
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className="text-center px-4 py-4 text-xs font-semibold text-navy-300 uppercase tracking-wider w-36"
                    >
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/30">
                {modules.map((mod) => (
                  <React.Fragment key={mod}>
                    {/* Module Header */}
                    <tr className="bg-navy-800/20">
                      <td
                        colSpan={roles.length + 1}
                        className="px-6 py-2.5 text-xs font-bold text-cyan-400 uppercase tracking-wider bg-navy-800/30"
                      >
                        {mod}
                      </td>
                    </tr>
                    {/* Module Permissions */}
                    {PERMISSIONS_LIST.filter((p) => p.module === mod).map((perm) => (
                      <tr
                        key={perm.id}
                        className="hover:bg-navy-800/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <p className="text-sm font-medium text-navy-200">
                                {perm.name}
                              </p>
                              <p className="text-xs text-navy-400 mt-0.5">
                                {perm.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        {roles.map((role) => {
                          const isChecked = (rolePermissions[perm.id] || []).includes(role);
                          const isLocked = role === "admin" && (perm.id === "user_manage" || perm.id === "sys_settings");

                          return (
                            <td key={role} className="px-4 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => togglePermission(perm.id, role)}
                                disabled={isLocked}
                                className={`inline-flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 ${
                                  isChecked
                                    ? isLocked
                                      ? "bg-cyan-500/20 text-cyan-400 cursor-not-allowed"
                                      : "bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
                                    : "bg-navy-800/50 text-navy-600 border border-navy-700/50 hover:border-navy-500 hover:text-navy-400"
                                }`}
                                aria-label={`Quyền ${perm.name} cho ${role}`}
                              >
                                {isLocked ? (
                                  <Lock className="h-4 w-4" />
                                ) : isChecked ? (
                                  <Check className="h-4 w-4 stroke-[3]" />
                                ) : (
                                  <X className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
