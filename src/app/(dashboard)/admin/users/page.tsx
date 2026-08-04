"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { Select } from "@/shared/ui/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/shared/ui/components/ui/dialog";
import { ROLE_LABELS, UserRole, type User } from "@/features/auth/auth.types";
import { formatDate } from "@/shared/utils/utils";
import { useUsers } from "@/features/auth/auth.hooks";
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const ROLE_BADGE_VARIANTS: Record<
  UserRole,
  "success" | "warning" | "cyan" | "default" | "secondary"
> = {
  [UserRole.Admin]: "cyan",
  [UserRole.Manager]: "warning",
  [UserRole.Role3]: "default",
  [UserRole.Role4]: "secondary",
  [UserRole.Consultant]: "success",
};

export default function AdminUsersPage() {
  const { users, isLoading, assignUser } = useUsers();
  const [search, setSearch] = useState("");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Consultant);
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleAssignRole = async () => {
    if (!selectedUserId) return;
    setIsAssigning(true);
    const success = await assignUser(selectedUserId, selectedRole, null);
    setIsAssigning(false);
    if (success) {
      setRoleDialogOpen(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-400" />
          Quản lý người dùng
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Quản lý tài khoản và phân quyền trong hệ thống
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/50 bg-navy-800/20">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/30">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-navy-400">
                      Đang tải danh sách người dùng...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-navy-400">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-navy-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="text-sm font-medium text-navy-200">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-300">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={ROLE_BADGE_VARIANTS[user.role]}>
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.isActive ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            Hoạt động
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-navy-500 text-sm">
                            <XCircle className="h-4 w-4" />
                            Vô hiệu
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSelectedRole(user.role);
                            setRoleDialogOpen(true);
                          }}
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Phân quyền
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogClose onClose={() => setRoleDialogOpen(false)} />
        <DialogHeader>
          <DialogTitle>Phân quyền người dùng</DialogTitle>
          <DialogDescription>
            Thay đổi vai trò cho {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50">
            <Avatar name={selectedUser?.name || ""} size="md" />
            <div>
              <p className="text-sm font-medium text-navy-200">
                {selectedUser?.name}
              </p>
              <p className="text-xs text-navy-500">{selectedUser?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-navy-300">
              Vai trò mới
            </label>
            <Select
              options={ROLE_OPTIONS}
              value={selectedRole.toString()}
              onChange={(e) => setSelectedRole(Number(e.target.value) as UserRole)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setRoleDialogOpen(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleAssignRole} isLoading={isAssigning}>
            Cập nhật
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
