"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import { useAuthStore } from "@/features/auth/auth.store";
import { canAccessAdmin } from "@/features/auth/auth.types";
import {
  useQueueMe,
  useQueueStatus,
  useMyActiveSla,
  useActiveSla,
} from "@/features/assignments/assignment.hooks";
import { formatDateTime } from "@/shared/utils/utils";
import {
  Users,
  Briefcase,
  Layers,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface MyQueueCardProps {
  trainingSystem?: number;
}

export function MyQueueCard({ trainingSystem }: MyQueueCardProps = {}) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user ? canAccessAdmin(user.role) : false;

  // --- Staff Data (GET /api/Assignment/queue/me & GET /api/Assignment/sla/me) ---
  const {
    data: myQueue,
    isLoading: isQueueMeLoading,
    refetch: refetchQueueMe,
    isRefetching: isRefetchingMe,
  } = useQueueMe(!isAdmin);

  const {
    data: myAssignedLeads = [],
    isLoading: isMySlaLoading,
    refetch: refetchMySla,
  } = useMyActiveSla();

  // --- Admin Data (GET /api/Assignment/queue & GET /api/Assignment/sla/active) ---
  const {
    data: teamQueue = [],
    isLoading: isTeamQueueLoading,
    refetch: refetchTeamQueue,
    isRefetching: isRefetchingTeam,
  } = useQueueStatus(trainingSystem);

  const {
    data: allActiveSla = [],
    isLoading: isAllSlaLoading,
    refetch: refetchAllSla,
  } = useActiveSla(trainingSystem);

  const handleRefresh = () => {
    if (isAdmin) {
      refetchTeamQueue();
      refetchAllSla();
    } else {
      refetchQueueMe();
      refetchMySla();
    }
  };

  const isRefetching = isAdmin ? isRefetchingTeam : isRefetchingMe;

  // =========================================================================
  // ADMIN VIEW: Tiến độ Phân công & Tải công việc Nhân viên
  // =========================================================================
  if (isAdmin) {
    const isTeamLoading = isTeamQueueLoading || isAllSlaLoading;
    const activeStaffCount = teamQueue.filter((q) => q.isActive).length;

    return (
      <Card className="border border-navy-700/30 bg-navy-800/20 backdrop-blur-md relative overflow-hidden">
        <CardHeader className="border-b border-navy-700/30 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base text-navy-100 font-bold">
              <Users className="h-5 w-5 text-cyan-400" />
              Tiến độ Phân công & Tải công việc Nhân viên
            </CardTitle>
            <p className="text-xs text-navy-400 mt-0.5">
              Theo dõi danh sách tư vấn viên đang trực tuyến và khả năng tiếp nhận lead tự động
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="h-8 px-2.5 text-navy-300 border-navy-700 hover:bg-navy-800"
            title="Làm mới tiến độ"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin text-cyan-400" : ""}`} />
            <span className="text-xs ml-1 hidden sm:inline">Làm mới</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-5">
          {/* Overview Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg bg-navy-900/40 border border-navy-700/40">
            <div>
              <span className="text-xs text-navy-400 font-medium block mb-0.5">Nhân viên đang Check-in</span>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">
                  {activeStaffCount} Tư vấn viên trực tuyến
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-navy-400 font-medium block mb-0.5">Tổng Lead đang phân bổ</span>
              <span className="text-sm font-bold text-cyan-400">
                {allActiveSla.length} Lead active
              </span>
            </div>
          </div>

          {/* Team Workload List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-navy-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                Danh sách Tư vấn viên trong hàng đợi ({teamQueue.length})
              </h4>
            </div>

            {isTeamLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-navy-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                Đang tải danh sách phân công nhân viên...
              </div>
            ) : teamQueue.length === 0 ? (
              <EmptyState
                title="Chưa có nhân viên nào Check-in"
                description="Hiện chưa có tư vấn viên nào bật trạng thái sẵn sàng nhận lead từ hệ thống."
              />
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {teamQueue.map((consultant, index) => {
                  const currentLoad = consultant.currentLoad ?? 0;
                  const maxLoad = consultant.maxLoad ?? 10;
                  const loadPercent = Math.min(100, Math.round((currentLoad / Math.max(1, maxLoad)) * 100));

                  return (
                    <div
                      key={consultant.consultantId || consultant.id || index}
                      className="p-3.5 rounded-xl bg-navy-900/50 border border-navy-700/30 hover:border-cyan-500/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={consultant.consultantName || "Nhân viên"} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-navy-100">
                              {consultant.consultantName || `Tư vấn viên (${consultant.consultantId?.substring(0, 8)})`}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Trực tuyến
                              </span>
                              {consultant.orderIndex > 0 && (
                                <span className="text-xs text-navy-400">
                                  • Thứ tự nhận lead: #{consultant.orderIndex}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                            Tải: {currentLoad} / {maxLoad} Lead
                          </Badge>
                          {consultant.lastAssignedAt && (
                            <p className="text-[11px] text-navy-400 flex items-center justify-end gap-1 mt-1">
                              <Clock className="h-3 w-3 text-navy-500" />
                              Gán gần nhất: {formatDateTime(consultant.lastAssignedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Workload Progress Bar */}
                      <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden border border-navy-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            loadPercent >= 90
                              ? "bg-rose-500"
                              : loadPercent >= 60
                              ? "bg-amber-500"
                              : "bg-cyan-500"
                          }`}
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // =========================================================================
  // STAFF / CONSULTANT VIEW: Hàng Đợi Cá Nhân (My Queue)
  // =========================================================================
  const isLoading = isQueueMeLoading || isMySlaLoading;
  const isActive = myQueue?.isActive ?? false;
  const currentLoad = myQueue?.currentLoad ?? myAssignedLeads.length;
  const maxLoad = myQueue?.maxLoad ?? 10;
  const loadPercentage = Math.min(100, Math.round((currentLoad / Math.max(1, maxLoad)) * 100));

  return (
    <Card className="border border-navy-700/30 bg-navy-800/20 backdrop-blur-md relative overflow-hidden">
      <CardHeader className="border-b border-navy-700/30 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-navy-100 font-bold">
          <Layers className="h-5 w-5 text-cyan-400" />
          Hàng Đợi Cá Nhân (My Queue)
        </CardTitle>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="h-8 px-2 text-navy-300 border-navy-700 hover:bg-navy-800"
            title="Làm mới hàng đợi"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin text-cyan-400" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Status & Workload Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg bg-navy-900/40 border border-navy-700/40">
          <div>
            <span className="text-xs text-navy-400 font-medium block mb-1">Trạng thái nhận Lead</span>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span className={`text-sm font-semibold ${isActive ? "text-emerald-400" : "text-navy-400"}`}>
                {isActive ? "Đang Check-in (Sẵn sàng nhận Lead)" : "Đã Check-out (Tắt nhận Lead)"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-navy-400 font-medium">Tải hiện tại (CurrentLoad)</span>
              <span className="text-xs font-bold text-cyan-400">
                {currentLoad} / {maxLoad} Lead
              </span>
            </div>
            <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-800">
              <div
                className={`h-full transition-all duration-500 ${
                  loadPercentage >= 90
                    ? "bg-rose-500"
                    : loadPercentage >= 60
                    ? "bg-amber-500"
                    : "bg-cyan-500"
                }`}
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Assigned Lead List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-navy-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Danh sách Lead được gán ({myAssignedLeads.length})
            </h4>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-navy-400 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              Đang tải danh sách hàng đợi...
            </div>
          ) : myAssignedLeads.length === 0 ? (
            <EmptyState
              title="Chưa có lead nào trong hàng đợi"
              description={
                isActive
                  ? "Bạn đã check-in. Hệ thống sẽ tự động phân bổ Lead tới hàng đợi của bạn khi có dữ liệu."
                  : "Vui lòng sử dụng nút Check-in trên thanh công cụ góc trên để bật trạng thái sẵn sàng nhận lead từ hệ thống."
              }
            />
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {myAssignedLeads.map((lead) => (
                <div
                  key={lead.id || lead.customerId}
                  className="p-3 rounded-lg bg-navy-900/50 border border-navy-700/30 hover:border-cyan-500/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={lead.customerName || "Lead"} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-navy-100">
                        {lead.customerName || `Khách hàng (${lead.customerId.substring(0, 8)})`}
                      </p>
                      <p className="text-xs text-navy-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-navy-500" />
                        Gán lúc: {formatDateTime(lead.assignedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-xs font-semibold flex items-center gap-1 ${lead.isViolated ? "text-rose-400" : "text-amber-400"}`}>
                        {lead.isViolated ? (
                          <>
                            <AlertCircle className="h-3 w-3 text-rose-400" />
                            Quá hạn SLA
                          </>
                        ) : (
                          `SLA: ${lead.remainingMinutes} phút`
                        )}
                      </span>
                    </div>
                    <Badge variant={lead.isViolated ? "destructive" : "cyan"} className="text-xs">
                      {lead.trainingSystem ? `Hệ: ${lead.trainingSystem}` : "Lead mới"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
