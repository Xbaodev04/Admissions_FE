"use client";

import { useAuthStore } from "@/store/auth-store";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  mockDashboardStats,
  mockAssignments,
  mockActivities,
} from "@/lib/mock-data";
import { formatDateTime, maskPhone } from "@/lib/utils";
import { canAccessAdmin } from "@/types/auth";
import Link from "next/link";
import {
  Users,
  Timer,
  AlertTriangle,
  UserX,
  GraduationCap,
  Car,
  BookOpen,
  UserPlus,
  Upload,
  ArrowRight,
  Activity,
  TrendingUp,
  Zap,
  UserCheck,
  FileWarning,
  CheckCircle2,
} from "lucide-react";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  lead_created: <Zap className="h-4 w-4 text-cyan-400" />,
  lead_assigned: <UserCheck className="h-4 w-4 text-emerald-400" />,
  evidence_added: <Upload className="h-4 w-4 text-amber-400" />,
  sla_warning: <FileWarning className="h-4 w-4 text-rose-400" />,
  lead_converted: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isManager = user ? canAccessAdmin(user.role) : false;
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-100">
          Xin chào, {user?.name?.split(" ").pop()} 👋
        </h1>
        <p className="text-navy-400 mt-1">
          Đây là tổng quan hoạt động tuyển sinh hôm nay.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <KpiCard
          title="Tổng Lead"
          value={stats.totalLeads}
          icon={Users}
          trend={stats.leadsTrend}
          trendLabel="so với tuần trước"
          variant="cyan"
        />
        <KpiCard
          title="SLA Đang xử lý"
          value={stats.activeSla}
          icon={Timer}
          trend={stats.slaTrend}
          trendLabel="so với tuần trước"
          variant="emerald"
        />
        <KpiCard
          title="SLA Quá hạn"
          value={stats.overdueSla}
          icon={AlertTriangle}
          trend={stats.overdueTrend}
          trendLabel="so với tuần trước"
          variant="rose"
        />
        <KpiCard
          title="Chưa giao"
          value={stats.unassignedLeads}
          icon={UserX}
          trend={stats.unassignedTrend}
          trendLabel="so với tuần trước"
          variant="amber"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/leads/create/formal">
              <Button variant="outline" className="gap-2">
                <GraduationCap className="h-4 w-4 text-cyan-400" />
                Tạo Lead Chính quy
              </Button>
            </Link>
            <Link href="/leads/create/driving">
              <Button variant="outline" className="gap-2">
                <Car className="h-4 w-4 text-amber-400" />
                Tạo Lead Lái xe
              </Button>
            </Link>
            <Link href="/leads/create/shortterm">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                Tạo Lead Ngắn hạn
              </Button>
            </Link>
            {isManager && (
              <Link href="/assignment">
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4 text-violet-400" />
                  Giao Lead
                </Button>
              </Link>
            )}
            <Link href="/evidence">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4 text-amber-400" />
                Upload Evidence
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Branch Overview + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Overview Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy-100 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Tổng quan nhánh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
            {/* Formal */}
            <Card hover>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-cyan-500/10 p-2">
                    <GraduationCap className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-200">Chính quy</p>
                    <p className="text-xs text-navy-500">Formal</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy-100">{stats.formalLeads}</p>
                <p className="text-xs text-navy-500 mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.formalLeads / stats.totalLeads) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Driving */}
            <Card hover>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <Car className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-200">Lái xe</p>
                    <p className="text-xs text-navy-500">Driving</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy-100">{stats.drivingLeads}</p>
                <p className="text-xs text-navy-500 mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.drivingLeads / stats.totalLeads) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ShortTerm */}
            <Card hover>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <BookOpen className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-200">Ngắn hạn</p>
                    <p className="text-xs text-navy-500">ShortTerm</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy-100">{stats.shorttermLeads}</p>
                <p className="text-xs text-navy-500 mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.shorttermLeads / stats.totalLeads) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-navy-100 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Hoạt động gần đây
          </h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {mockActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-navy-800/50 transition-colors"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {ACTIVITY_ICONS[activity.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy-300">
                      <span className="font-medium text-navy-200">
                        {activity.user}
                      </span>{" "}
                      {activity.message}
                    </p>
                    <p className="text-xs text-navy-500 mt-0.5">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assignments Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cyan-400" />
            Giao việc gần đây
          </h2>
          {isManager && (
            <Link href="/assignment">
              <Button variant="ghost" size="sm" className="gap-1 text-cyan-400">
                Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Tư vấn viên
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Nhánh
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">
                    Ngày giao
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/30">
                {mockAssignments.slice(0, 5).map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-navy-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={assignment.customerName} size="sm" />
                        <span className="text-sm font-medium text-navy-200">
                          {assignment.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-navy-300">
                      {assignment.consultantName}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          assignment.branch === "formal"
                            ? "cyan"
                            : assignment.branch === "driving"
                            ? "warning"
                            : "success"
                        }
                      >
                        {assignment.branch === "formal"
                          ? "Chính quy"
                          : assignment.branch === "driving"
                          ? "Lái xe"
                          : "Ngắn hạn"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={assignment.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-navy-400">
                      {formatDateTime(assignment.assignedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
