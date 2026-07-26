"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { KpiCard } from "@/components/shared/kpi-card";
import { mockSlaItems } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Phone,
} from "lucide-react";
import type { SlaStatus } from "@/types/common";

const SLA_STATUS_CONFIG: Record<
  SlaStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: React.ReactNode }
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
  completed: {
    label: "Hoàn thành",
    variant: "secondary",
    icon: <CheckCircle2 className="h-4 w-4 text-navy-400" />,
  },
};

export default function SlaPage() {
  const onTrack = mockSlaItems.filter((s) => s.status === "on_track").length;
  const atRisk = mockSlaItems.filter((s) => s.status === "at_risk").length;
  const overdue = mockSlaItems.filter((s) => s.status === "overdue").length;
  const completed = mockSlaItems.filter((s) => s.status === "completed").length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Timer className="h-5 w-5 text-cyan-400" />
          SLA — Cam kết thời gian xử lý
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Theo dõi tiến độ xử lý lead theo SLA
        </p>
      </div>

      {/* SLA Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 stagger-children">
        <KpiCard title="Đúng tiến độ" value={onTrack} icon={CheckCircle2} variant="emerald" />
        <KpiCard title="Có rủi ro" value={atRisk} icon={AlertTriangle} variant="amber" />
        <KpiCard title="Quá hạn" value={overdue} icon={XCircle} variant="rose" />
        <KpiCard title="Hoàn thành" value={completed} icon={Timer} variant="cyan" />
      </div>

      {/* SLA List */}
      <Card>
        <CardContent className="p-0">
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
                    Còn lại
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Liên hệ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/30">
                {mockSlaItems.map((item) => {
                  const config = SLA_STATUS_CONFIG[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-navy-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={item.customerName} size="sm" />
                          <span className="text-sm font-medium text-navy-200">
                            {item.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-300">
                        {item.consultantName}
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
                            item.remainingHours < 0
                              ? "text-rose-400"
                              : item.remainingHours < 24
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {item.remainingHours < 0
                            ? `Quá ${Math.abs(item.remainingHours)}h`
                            : `${item.remainingHours}h`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-sm text-navy-300">
                          <Phone className="h-3.5 w-3.5 text-navy-500" />
                          {item.contactAttempts} lần
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
