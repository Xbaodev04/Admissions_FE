"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { KpiCard } from "@/shared/ui/components/shared/kpi-card";
import { formatDateTime } from "@/shared/utils/utils";
import type { ActiveSlaDto } from "@/features/assignments/assignment.types";
import { assignmentService } from "@/features/assignments/assignment.service";
import { useState, useEffect } from "react";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";

type SlaStatus = "on_track" | "at_risk" | "overdue";

const SLA_STATUS_CONFIG: Record<
  SlaStatus,
  { label: string; variant: "success" | "warning" | "destructive"; icon: React.ReactNode }
> = {
  on_track: {
    label: "Đúng tiến độ",
    variant: "success",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  },
  at_risk: {
    label: "Có rủi ro",
    variant: "warning",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  },
  overdue: {
    label: "Quá hạn",
    variant: "destructive",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
  },
};

export default function SlaPage() {
  const [slaItems, setSlaItems] = useState<ActiveSlaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSla = async () => {
      try {
        const data = await assignmentService.getActiveSla(2); // 2 = Formal
        setSlaItems(data);
      } catch (error) {
        console.error("Failed to fetch SLA:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSla();
  }, []);

  const getStatus = (item: ActiveSlaDto): SlaStatus => {
    if (item.isViolated) return "overdue";
    if (item.remainingMinutes <= 60) return "at_risk";
    return "on_track";
  };

  const overdue = slaItems.filter((s) => s.isViolated).length;
  const atRisk = slaItems.filter((s) => !s.isViolated && s.remainingMinutes <= 60).length;
  const onTrack = slaItems.filter((s) => !s.isViolated && s.remainingMinutes > 60).length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Timer className="h-5 w-5 text-cyan-400" />
          SLA — Cam kết thời gian xử lý
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Theo dõi tiến độ liên hệ và chăm sóc lead theo SLA quy định
        </p>
      </div>

      {/* SLA Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <KpiCard title="Đúng tiến độ" value={onTrack} icon={CheckCircle2} variant="emerald" />
        <KpiCard title="Có rủi ro (<60m)" value={atRisk} icon={AlertTriangle} variant="amber" />
        <KpiCard title="Quá hạn" value={overdue} icon={XCircle} variant="rose" />
      </div>

      {/* SLA List */}
      <Card>
        <CardContent className="p-0 relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm font-medium text-navy-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : slaItems.length === 0 ? (
            <EmptyState
              title="Không có SLA nào đang chạy"
              description="Hiện tại tất cả lead đã được liên hệ đúng hạn."
              icon={<Timer className="h-8 w-8 text-navy-500" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700/50 bg-navy-800/20">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Tư vấn viên
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Thời hạn
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Thời gian còn lại
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Ngày nhận
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {slaItems.map((item) => {
                    const status = getStatus(item);
                    const config = SLA_STATUS_CONFIG[status];
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-navy-800/30 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={item.customerName || "User"} size="sm" />
                            <span className="text-sm font-medium text-navy-200">
                              {item.customerName || "Ẩn danh"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-navy-300">
                          {item.assigneeName || "Chưa giao"}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <Badge variant={config.variant}>
                              {config.label}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 text-sm text-navy-300">
                            <Clock className="h-3.5 w-3.5 text-navy-500" />
                            {formatDateTime(item.deadline)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-sm font-medium ${
                              item.isViolated
                                ? "text-rose-400"
                                : item.remainingMinutes <= 60
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {item.isViolated
                              ? `Quá ${Math.abs(Math.floor(item.remainingMinutes / 60))}h ${Math.abs(item.remainingMinutes % 60)}m`
                              : `${Math.floor(item.remainingMinutes / 60)}h ${item.remainingMinutes % 60}m`}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-navy-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-navy-500" />
                            {formatDateTime(item.assignedAt)}
                          </div>
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

