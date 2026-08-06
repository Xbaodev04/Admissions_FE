"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import { formatDateTime } from "@/shared/utils/utils";
import { useQueueStatus } from "@/features/assignments/assignment.hooks";
import {
  ClipboardList,
  Clock,
} from "lucide-react";

const TRAINING_SYSTEM_OPTIONS = [
  { value: "", label: "Tất cả hệ đào tạo" },
  { value: "2", label: "Chính quy (Formal)" },
  { value: "1", label: "Sơ cấp (ShortTerm)" },
  { value: "3", label: "Lái xe (Driving)" },
];

export default function QueuePage() {
  const [selectedSystem, setSelectedSystem] = useState<string>("2");
  const trainingSystem = selectedSystem ? Number(selectedSystem) : undefined;
  const { data: rawQueue = [], isLoading } = useQueueStatus(trainingSystem);

  const queue = [...rawQueue].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-400" />
            Queue — Hàng đợi nhận Lead
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Danh sách tư vấn viên đang xếp hàng đợi nhận Lead tự động
          </p>
        </div>
        <select
          className="h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          value={selectedSystem}
          onChange={(e) => setSelectedSystem(e.target.value)}
        >
          {TRAINING_SYSTEM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy-900 text-navy-100">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0 relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm font-medium text-navy-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : queue.length === 0 ? (
            <EmptyState
              title="Hàng đợi trống"
              description="Hiện không có tư vấn viên nào đang trong hàng đợi nhận lead."
              icon={<ClipboardList className="h-8 w-8 text-navy-500" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700/50 bg-navy-800/20">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider w-16">
                      Thứ tự
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Tư vấn viên
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Tải hiện tại
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Tải tối đa
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Lần giao cuối
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {queue.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-navy-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-bold text-cyan-400">
                        #{item.orderIndex}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={item.consultantName || "User"} size="sm" />
                          <span className="text-sm font-medium text-navy-200">
                            {item.consultantName || "Ẩn danh"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-300">
                        {item.currentLoad} leads
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-300">
                        {item.maxLoad} leads
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={item.isActive ? "success" : "secondary"}>
                          {item.isActive ? "Sẵn sàng" : "Ngoại tuyến / Bận"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-400">
                        {item.lastAssignedAt ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-navy-500" />
                            {formatDateTime(item.lastAssignedAt)}
                          </div>
                        ) : (
                          "Chưa được giao"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

