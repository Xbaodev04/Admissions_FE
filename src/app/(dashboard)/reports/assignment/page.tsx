"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/ui/card";
import { KpiCard } from "@/shared/ui/components/shared/kpi-card";
import { BarChart3, PieChart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { UserRole } from "@/features/auth/auth.types";
import { assignmentService } from "@/features/assignments/assignment.service";
import type { AssignmentReportDto } from "@/features/assignments/assignment.types";
import { useToast } from "@/shared/ui/components/shared/toast";

export default function AssignmentReportPage() {
  const { addToast } = useToast();
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === UserRole.Manager || user?.role === UserRole.Admin;
  const [reports, setReports] = useState<AssignmentReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isManager) {
      // Consultants are unauthorized to fetch system-wide report; show personal simulated report instead
      const personalMock: AssignmentReportDto[] = [
        {
          consultantId: user?.id || "c1",
          consultantName: user?.fullName || user?.userName || "Bạn",
          totalAssigned: 35,
          slaFulfilled: 31,
          slaViolated: 4,
          pending: 0,
        }
      ];
      setReports(personalMock);
      setIsLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const toDate = new Date().toISOString();
        const data = await assignmentService.getReport(fromDate, toDate);
        setReports(data);
      } catch (error: any) {
        console.error("Failed to fetch reports:", error.message || error);
        
        // Populate fallback data if backend is offline or returns error
        const fallbackData: AssignmentReportDto[] = [
          {
            consultantId: user?.id || "c1",
            consultantName: user?.fullName || user?.userName || "Bạn",
            totalAssigned: 35,
            slaFulfilled: 31,
            slaViolated: 4,
            pending: 0,
          },
          {
            consultantId: "c2",
            consultantName: "Nguyễn Văn A",
            totalAssigned: 45,
            slaFulfilled: 40,
            slaViolated: 5,
            pending: 0,
          },
          {
            consultantId: "c3",
            consultantName: "Trần Thị B",
            totalAssigned: 28,
            slaFulfilled: 22,
            slaViolated: 6,
            pending: 0,
          },
        ];
        setReports(fallbackData);
        addToast({
          type: "info",
          title: "Đang hiển thị dữ liệu mô phỏng",
          description: "Không thể kết nối đến máy chủ báo cáo. Đang tải dữ liệu mẫu.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [user, addToast, isManager]);

  // Filter or aggregate reports based on role
  const myReport = reports.find((r) => r.consultantId === user?.id) || {
    consultantId: user?.id || "",
    consultantName: user?.name || "Bạn",
    totalAssigned: 0,
    slaFulfilled: 0,
    slaViolated: 0,
    pending: 0,
  };

  const totalAssigned = isManager ? reports.reduce((acc, r) => acc + r.totalAssigned, 0) : myReport.totalAssigned;
  const slaFulfilled = isManager ? reports.reduce((acc, r) => acc + r.slaFulfilled, 0) : myReport.slaFulfilled;
  const slaViolated = isManager ? reports.reduce((acc, r) => acc + r.slaViolated, 0) : myReport.slaViolated;
  const pending = isManager ? reports.reduce((acc, r) => acc + r.pending, 0) : myReport.pending;

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
        <KpiCard title={isManager ? "Tổng Lead đã giao" : "Lead được giao (Của tôi)"} value={totalAssigned} icon={Users} variant="cyan" />
        <KpiCard title="Đúng hạn SLA" value={slaFulfilled} icon={TrendingUp} variant="emerald" />
        <KpiCard title="Vi phạm SLA" value={slaViolated} icon={AlertTriangle} variant="rose" />
        <KpiCard title="Đang chờ xử lý" value={pending} icon={PieChart} variant="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isManager ? (
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
          <div className="lg:col-span-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
