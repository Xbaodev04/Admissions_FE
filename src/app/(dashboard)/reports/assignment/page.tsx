"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/ui/card";
import { KpiCard } from "@/shared/ui/components/shared/kpi-card";
import { Button } from "@/shared/ui/components/ui/button";
import { BarChart3, PieChart, Users, TrendingUp, AlertTriangle, Phone } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { UserRole } from "@/features/auth/auth.types";
import { useAssignmentReport, useActiveSla } from "@/features/assignments/assignment.hooks";

export default function AssignmentReportPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === UserRole.Admin;

  const fromDate = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), []);
  const toDate = useMemo(() => new Date().toISOString(), []);

  // Fetch using React Query
  const { data: reports = [], isLoading, isError } = useAssignmentReport(fromDate, toDate);
  const { data: allActiveSla = [] } = useActiveSla();
  const myActiveLeads = useMemo(() => {
    return allActiveSla.filter((s) => s.assigneeId === user?.id);
  }, [allActiveSla, user]);

  // Filter or aggregate reports based on role
  const myReport = useMemo(() => {
    return reports.find((r) => r.consultantId === user?.id) || {
      consultantId: user?.id || "",
      consultantName: user?.name || "Bạn",
      totalAssigned: 0,
      slaFulfilled: 0,
      slaViolated: 0,
      pending: 0,
    };
  }, [reports, user]);

  const totalAssigned = isAdmin ? reports.reduce((acc, r) => acc + r.totalAssigned, 0) : myReport.totalAssigned;
  const slaFulfilled = isAdmin ? reports.reduce((acc, r) => acc + r.slaFulfilled, 0) : myReport.slaFulfilled;
  const slaViolated = isAdmin ? reports.reduce((acc, r) => acc + r.slaViolated, 0) : myReport.slaViolated;
  const pending = isAdmin ? reports.reduce((acc, r) => acc + r.pending, 0) : myReport.pending;

  const fulfillmentRate = totalAssigned > 0 ? Math.round((slaFulfilled / totalAssigned) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6 relative min-h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="text-sm font-medium text-navy-400">Đang tải báo cáo...</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary dark:text-cyan-400" />
          Báo cáo Phân bổ & Hiệu suất Lead
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Thống kê và đánh giá chi tiết chất lượng xử lý lead theo cam kết thời gian SLA
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={isAdmin ? "Tổng Lead đã giao" : "Lead được giao (Của tôi)"} value={totalAssigned} icon={Users} variant="cyan" />
        <KpiCard title="Đúng hạn SLA" value={slaFulfilled} icon={TrendingUp} variant="emerald" />
        <KpiCard title="Vi phạm SLA" value={slaViolated} icon={AlertTriangle} variant="rose" />
        <KpiCard title="Đang chờ xử lý" value={pending} icon={PieChart} variant="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isAdmin ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Tỉ lệ phân bổ theo Nhân viên</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">Chưa có dữ liệu phân bổ.</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((r) => {
                      const percent = totalAssigned > 0 ? Math.round((r.totalAssigned / totalAssigned) * 100) : 0;
                      return (
                        <div key={r.consultantId}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-700 dark:text-slate-200">{r.consultantName || "Ẩn danh"}</span>
                            <span className="text-slate-500">{r.totalAssigned} leads ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Hiệu suất xử lý SLA</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">Chưa có dữ liệu xử lý SLA.</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((r) => {
                      const rate = r.totalAssigned > 0 ? Math.round((r.slaFulfilled / r.totalAssigned) * 100) : 0;
                      return (
                        <div key={r.consultantId}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700 dark:text-slate-200">{r.consultantName || "Ẩn danh"}</span>
                            <span className={rate >= 80 ? "text-emerald-500" : rate >= 50 ? "text-amber-500" : "text-rose-500"}>
                              {rate}% đúng hạn
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${rate >= 80 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hiệu suất xử lý SLA (Cá nhân)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 dark:text-slate-200">Bạn ({user?.name || "Tư vấn viên"})</span>
                      <span className={fulfillmentRate >= 80 ? "text-emerald-500" : fulfillmentRate >= 50 ? "text-amber-500" : "text-rose-500"}>
                        {fulfillmentRate}% đúng hạn
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${fulfillmentRate >= 80 ? "bg-emerald-500" : fulfillmentRate >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${fulfillmentRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Danh sách khách hàng cần liên hệ (SLA đang chạy)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myActiveLeads.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">
                    Hiện tại bạn không có khách hàng nào cần liên hệ gấp.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                          <th className="py-3 px-4">Tên khách hàng</th>
                          <th className="py-3 px-4">Hệ đào tạo</th>
                          <th className="py-3 px-4">Thời gian nhận</th>
                          <th className="py-3 px-4">SLA còn lại</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myActiveLeads.map((lead) => {
                          const isWarning = lead.remainingMinutes <= 10;
                          return (
                            <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-sm">
                              <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                                {lead.customerName || "Ẩn danh"}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">
                                {lead.trainingSystem === "2" || lead.trainingSystem?.toLowerCase().includes("formal") ? "Chính quy" : lead.trainingSystem === "3" || lead.trainingSystem?.toLowerCase().includes("driving") ? "Lái xe" : "Sơ cấp"}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">
                                {new Date(lead.assignedAt).toLocaleTimeString()} {new Date(lead.assignedAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isWarning ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                                  {lead.remainingMinutes} phút {lead.isViolated && "(Quá hạn)"}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Link href={`/evidence?customerId=${lead.customerId}`}>
                                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                                    <Phone className="h-3.5 w-3.5" />
                                    Liên hệ & Upload
                                  </Button>
                                </Link>
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
        )}
      </div>
    </div>
  );
}
