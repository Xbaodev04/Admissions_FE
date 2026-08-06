"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { Badge } from "@/shared/ui/components/ui/badge";
import { useUsers, useTeams } from "@/features/auth/auth.hooks";
import { UserRole, ROLE_LABELS, ROLE_TEAM_LABELS, type UserDto, normalizeRole } from "@/features/auth/auth.types";
import { Users, RefreshCw } from "lucide-react";

export default function UsersManagementPage() {
  const { userDtos, isLoading, refresh, assignUser } = useUsers();
  const { teams, isLoading: isLoadingTeams } = useTeams();

  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Values for role/team editing
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const handleStartEdit = (user: UserDto) => {
    setAssigningUserId(user.id);
    setSelectedRole(String(user.role));
    setSelectedTeam(user.teamId || "");
  };

  const handleCancelEdit = () => {
    setAssigningUserId(null);
    setSelectedRole("");
    setSelectedTeam("");
  };

  const handleSaveUser = async (userId: string) => {
    setIsProcessing(true);
    try {
      const roleNum = selectedRole ? Number(selectedRole) : null;
      const teamVal = selectedTeam || null;
      
      const success = await assignUser(userId, roleNum, teamVal);
      if (success) {
        handleCancelEdit();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in relative min-h-[500px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            Quản lý Người Dùng & Nhóm
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Cấp quyền vai trò và phân bổ thành viên vào các nhóm tuyển sinh
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} className="gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Làm mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 relative min-h-[300px]">
          {isLoading || isLoadingTeams ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm font-medium text-navy-400">Đang tải danh sách người dùng...</p>
              </div>
            </div>
          ) : userDtos.length === 0 ? (
            <div className="py-12 text-center text-navy-400">
              Không tìm thấy người dùng nào trong hệ thống.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700/50 bg-navy-800/20">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Số điện thoại / Định danh
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Nhóm (Team)
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {userDtos.map((userDto) => {
                    const isEditing = assigningUserId === userDto.id;
                    const teamName = teams.find((t) => t.id === userDto.teamId)?.name;
                    
                    return (
                      <tr key={userDto.id} className="hover:bg-navy-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={userDto.fullName || userDto.userName || "User"} size="sm" />
                            <div>
                              <span className="text-sm font-medium text-navy-200 block">
                                {userDto.fullName || "Ẩn danh"}
                              </span>
                              <span className="text-xs text-navy-400 block">
                                {userDto.userName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-navy-300">
                          <div>
                            <span className="block">{userDto.mobile || "—"}</span>
                            <span className="text-xs text-navy-500 block">{userDto.identificationNumber || "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-navy-300">
                          {isEditing ? (
                            <select
                              className="h-9 rounded-md border border-navy-700/50 bg-navy-800/50 px-2 py-1 text-xs text-navy-100 outline-none"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                <option key={value} value={value} className="bg-navy-900 text-navy-100">
                                  {label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Badge variant={normalizeRole(userDto.role) === UserRole.Admin ? "destructive" : "secondary"}>
                              {ROLE_LABELS[normalizeRole(userDto.role)] || `Vai trò ${userDto.role}`}
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-navy-300">
                          {isEditing ? (
                            <select
                              className="h-9 rounded-md border border-navy-700/50 bg-navy-800/50 px-2 py-1 text-xs text-navy-100 outline-none w-48"
                              value={selectedTeam}
                              onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                              <option value="" className="bg-navy-900 text-navy-400">
                                -- Không thuộc nhóm --
                              </option>
                              {teams.map((team) => (
                                <option key={team.id} value={team.id} className="bg-navy-950 text-navy-100">
                                  {team.name} ({ROLE_TEAM_LABELS[team.roleTeam!] || "Chung"})
                                </option>
                              ))}
                            </select>
                          ) : userDto.teamId ? (
                            <Badge variant="cyan">
                              {teamName || "Đang tải..."}
                            </Badge>
                          ) : (
                            <span className="text-navy-500 italic text-xs">Chưa thuộc nhóm nào</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isEditing ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                onClick={() => handleSaveUser(userDto.id)}
                                disabled={isProcessing}
                              >
                                Lưu
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                disabled={isProcessing}
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(userDto)}
                            >
                              Chỉnh sửa
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
