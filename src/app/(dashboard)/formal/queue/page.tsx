"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { mockQueue } from "@/lib/mock-data";
import { maskPhone, formatDateTime } from "@/lib/utils";
import {
  ClipboardList,
  Clock,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const PRIORITY_VARIANTS: Record<string, "destructive" | "warning" | "default"> = {
  high: "destructive",
  medium: "warning",
  low: "default",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

export default function QueuePage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-cyan-400" />
          Queue — Hàng đợi giao Lead
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Các lead đang chờ được giao cho tư vấn viên
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {mockQueue.length === 0 ? (
            <EmptyState
              title="Hàng đợi trống"
              description="Hiện không có lead nào đang chờ giao."
              icon={<ClipboardList className="h-8 w-8 text-navy-500" />}
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
                      SĐT
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Ưu tiên
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                      Thời gian chờ
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
                  {mockQueue.map((item) => (
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
                        {maskPhone(item.customerPhone)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={PRIORITY_VARIANTS[item.priority]}>
                          {PRIORITY_LABELS[item.priority]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-sm text-navy-300">
                          <Clock className="h-3.5 w-3.5 text-navy-500" />
                          {item.waitingTime}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-navy-400">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href="/assignment">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <UserPlus className="h-3.5 w-3.5" />
                            Giao
                          </Button>
                        </Link>
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
