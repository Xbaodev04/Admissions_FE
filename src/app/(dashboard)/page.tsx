"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { useActiveSla } from "@/features/assignments/assignment.hooks";
import { KpiCard } from "@/shared/ui/components/shared/kpi-card";
import { StatusBadge } from "@/shared/ui/components/shared/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Button } from "@/shared/ui/components/ui/button";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import type { ActivityItem, Assignment } from "@/features/assignments/assignment.types";
import { formatDateTime } from "@/shared/utils/utils";
import { canAccessAdmin } from "@/features/auth/auth.types";
import type { AssignmentStatus } from "@/shared/types/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const router = useRouter();

  // Fetch real data from API (Unconditional, top of the component)
  const { data: allSla = [] } = useActiveSla();
  const { data: formalSla = [] } = useActiveSla(2);
  const { data: shorttermSla = [] } = useActiveSla(1);
  const { data: drivingSla = [] } = useActiveSla(3);

  useEffect(() => {
    if (user && !isManager) {
      router.replace("/reports/assignment");
    }
  }, [user, isManager, router]);

  if (!user || !isManager) {
    return null; // or a loading spinner, but null is fine to prevent flash
  }

  const overdueSla = allSla.filter((s) => s.isViolated).length;
  const activeSla = allSla.filter((s) => !s.isViolated).length;
  const totalLeads = allSla.length;
  const unassignedLeads = 0; // Backend has no direct endpoint for unassigned count

  const stats = {
    totalLeads,
    leadsTrend: 0,
    activeSla,
    slaTrend: 0,
    overdueSla,
    overdueTrend: 0,
    unassignedLeads,
    unassignedTrend: 0,
    formalLeads: formalSla.length,
    drivingLeads: drivingSla.length,
    shorttermLeads: shorttermSla.length,
  };

  const getBranchKey = (sys?: string | null): string => {
    if (!sys) return "formal";
    const s = sys.toString().toLowerCase();
    if (s === "2" || s.includes("formal") || s.includes("chính quy")) return "formal";
    if (s === "3" || s.includes("driving") || s.includes("lái xe")) return "driving";
    if (s === "1" || s.includes("shortterm") || s.includes("ngắn hạn")) return "shortterm";
    return "formal";
  };

  const activities: ActivityItem[] = allSla
    .map((sla) => ({
      id: `act-${sla.id}`,
      type: (sla.isViolated ? "sla_warning" : "lead_assigned") as "lead_assigned" | "sla_warning",
      message: sla.isViolated
        ? `vi phạm SLA phản hồi cho khách hàng ${sla.customerName || "Ẩn danh"}`
        : `được phân bổ cho ${sla.assigneeName || "Tư vấn viên"}`,
      user: sla.isViolated ? (sla.assigneeName || "Tư vấn viên") : (sla.customerName || "Khách hàng"),
      timestamp: sla.assignedAt,
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const assignments: Assignment[] = allSla
    .map((sla) => ({
      id: sla.id,
      customerId: sla.customerId,
      customerName: sla.customerName || "Khách hàng",
      consultantId: sla.assigneeId,
      consultantName: sla.assigneeName || "Tư vấn viên",
      branch: getBranchKey(sla.trainingSystem),
      status: (sla.isViolated ? "expired" : "pending") as AssignmentStatus,
      assignedAt: sla.assignedAt,
    }))
    .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Xin chào, {user?.name?.split(" ").pop()} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
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
          </div>
        </CardContent>
      </Card>

      {/* Branch Overview + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Overview Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400 dark:text-cyan-500" />
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
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chính quy</p>
                    <p className="text-xs text-muted-foreground">Formal</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.formalLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Lái xe</p>
                    <p className="text-xs text-muted-foreground">Driving</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.drivingLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ngắn hạn</p>
                    <p className="text-xs text-muted-foreground">ShortTerm</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.shorttermLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">lead trong hệ thống</p>
                <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400 dark:text-cyan-500" />
            Hoạt động gần đây
          </h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Không có hoạt động nào gần đây.
                </div>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {ACTIVITY_ICONS[activity.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activity.user}
                        </span>{" "}
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assignments Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cyan-400 dark:text-cyan-500" />
            Giao việc gần đây
          </h2>
          {isManager && (
            <Link href="/assignment">
              <Button variant="ghost" size="sm" className="gap-1 text-cyan-600 dark:text-cyan-400">
                Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tư vấn viên
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nhánh
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ngày giao
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-sm text-muted-foreground">
                      Không có lượt phân bổ nào gần đây.
                    </td>
                  </tr>
                ) : (
                  assignments.slice(0, 5).map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={assignment.customerName} size="sm" />
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {assignment.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
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
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {formatDateTime(assignment.assignedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
