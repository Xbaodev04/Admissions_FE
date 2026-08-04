"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { KpiCard } from "@/shared/ui/components/shared/kpi-card";
import { Users, Clock, Zap, CheckCircle2, XCircle } from "lucide-react";

// Mock data for shifts
const mockShifts = [
  { id: 1, name: "Nguyễn Văn A", role: "Tư vấn viên", status: "online", startTime: "08:00 AM", leadsAssigned: 12, slaViolations: 0 },
  { id: 2, name: "Trần Thị B", role: "Tư vấn viên", status: "online", startTime: "08:15 AM", leadsAssigned: 15, slaViolations: 1 },
  { id: 3, name: "Lê Văn C", role: "Tư vấn viên", status: "offline", startTime: "-", leadsAssigned: 0, slaViolations: 0 },
  { id: 4, name: "Phạm Thị D", role: "Tư vấn viên", status: "offline", startTime: "-", leadsAssigned: 0, slaViolations: 0 },
];

export default function ShiftsPage() {
  const [shifts] = useState(mockShifts);

  const totalOnline = shifts.filter(s => s.status === "online").length;
  const totalOffline = shifts.filter(s => s.status === "offline").length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-400" />
          Quản lý Ca làm việc (Check-in)
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Theo dõi trạng thái làm việc của nhân viên để phân bổ Lead tự động
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Đang trực tuyến" value={totalOnline} icon={CheckCircle2} variant="emerald" />
        <KpiCard title="Đang nghỉ" value={totalOffline} icon={XCircle} variant="default" />
        <KpiCard title="Lead đã giao hôm nay" value={27} icon={Zap} variant="cyan" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách Nhân viên</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/50 bg-navy-800/20">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Giờ Check-in
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Lead đã nhận (Hôm nay)
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Vi phạm SLA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/30">
                {shifts.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-navy-200">{item.name}</p>
                          <p className="text-xs text-navy-500">{item.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.status === "online" ? (
                        <Badge variant="success" className="gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Trực tuyến
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Đang nghỉ
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-navy-300">
                        <Clock className="h-3.5 w-3.5 text-navy-500" />
                        {item.startTime}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-navy-300 font-medium">
                      {item.leadsAssigned} lead
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-sm font-medium ${
                          item.slaViolations > 0 ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {item.slaViolations}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
