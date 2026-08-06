"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { Timeline } from "@/shared/ui/components/shared/timeline";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  History,
  AlertTriangle,
  UserPlus,
  ArrowLeftRight,
  CheckCircle2,
  FileWarning,
  FileText,
} from "lucide-react";
import { useActiveSla, useAssignmentHistory, useEvidence } from "@/features/assignments/assignment.hooks";
import { formatDateTime } from "@/shared/utils/utils";
import { useAuthStore } from "@/features/auth/auth.store";
import { RoleTeam } from "@/features/auth/auth.types";

export default function LeadDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.roleTeam === RoleTeam.Formal) {
      router.replace("/reports/assignment");
    }
  }, [user, router]);

  // Query active SLAs to find this customer's info
  const { data: activeSlas = [] } = useActiveSla();
  const activeSlaInfo = useMemo(() => {
    return activeSlas.find((s) => s.customerId === customerId);
  }, [activeSlas, customerId]);

  // Query assignment history and evidence
  const { data: historyItems = [], isLoading: isLoadingHistory } = useAssignmentHistory(customerId);
  const { data: evidenceItems = [], isLoading: isLoadingEvidence } = useEvidence(customerId);

  const customerName = activeSlaInfo?.customerName || historyItems[0]?.assigneeName || "Khách hàng";
  
  // Combine History & Evidence into a unified timeline
  const timelineItems = useMemo(() => {
    const items: Array<{
      id: string | number;
      title: string;
      description: string;
      timestamp: string;
      icon: React.ReactNode;
      status: "default" | "success" | "warning" | "destructive";
    }> = [];

    // Map history entries
    historyItems.forEach((h) => {
      items.push({
        id: `hist-${h.id}`,
        title: h.reason || "Lịch sử phân công",
        description: `Giao cho: ${h.assigneeName || "Ẩn danh"}. Ghi chú: ${h.note || "Không có"}`,
        timestamp: h.assignmentDate,
        icon: <UserPlus className="h-4 w-4 text-emerald-400" />,
        status: h.reason === "ManualAssign" ? "success" : "default",
      });
    });

    // Map evidence entries
    evidenceItems.forEach((e) => {
      items.push({
        id: `ev-${e.id}`,
        title: "Bằng chứng liên hệ",
        description: `${e.description || "Tư vấn viên nộp bằng chứng"}${e.durationSeconds ? ` (Thời lượng: ${e.durationSeconds} giây)` : ""}`,
        timestamp: e.createdAt,
        icon: <CheckCircle2 className="h-4 w-4 text-cyan-400" />,
        status: "success",
      });
    });

    // Sort by timestamp ascending
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [historyItems, evidenceItems]);

  const isLoading = isLoadingHistory || isLoadingEvidence;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-400" />
          Chi tiết Khách hàng: {customerName}
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Xem thông tin và lịch sử phân bổ của khách hàng này.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-navy-700/50">
                <Avatar name={customerName} size="md" />
                <div>
                  <p className="text-sm font-medium text-navy-100">{customerName}</p>
                  <Badge variant={activeSlaInfo?.isViolated ? "destructive" : "cyan"} className="mt-1">
                    {activeSlaInfo ? (activeSlaInfo.isViolated ? "Vi phạm SLA" : "Đang xử lý") : "Đã hoàn thành"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">
                    Hệ đào tạo: {activeSlaInfo?.trainingSystem || "Formal"}
                  </span>
                </div>
                {activeSlaInfo && (
                  <div className="flex items-center gap-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-rose-400">
                      SLA: {activeSlaInfo.remainingMinutes} phút còn lại
                    </span>
                  </div>
                )}
                {activeSlaInfo?.assigneeName && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-navy-400" />
                    <span className="text-navy-200">
                      Tư vấn viên phụ trách: {activeSlaInfo.assigneeName}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-navy-400" />
                  <span className="text-navy-200">
                    Mã khách hàng: {customerId}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead History Session */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-amber-400" />
                Session Lịch sử Phân bổ & Xử lý (Audit Trail)
              </CardTitle>
            </CardHeader>
            <CardContent className="relative min-h-[200px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 z-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                </div>
              ) : timelineItems.length === 0 ? (
                <div className="py-12 text-center text-navy-400">
                  Chưa có lịch sử phân bổ hoặc xử lý cho khách hàng này.
                </div>
              ) : (
                <Timeline items={timelineItems as any} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
