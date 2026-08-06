"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { ConfirmDialog } from "@/shared/ui/components/shared/confirm-dialog";
import { useToast } from "@/shared/ui/components/shared/toast";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
import { type UserDto } from "@/features/auth/auth.types";
import { useActiveSla, useQueueStatus, useManualAssign } from "@/features/assignments/assignment.hooks";
import { TrainingSystem, TRAINING_SYSTEM_LABELS } from "@/shared/contracts/api-contracts";
import {
  Search,
  UserPlus,
  Users,
  ArrowRight,
  Clock,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

export default function AssignmentPage() {
  const { addToast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [selectedSystem, setSelectedSystem] = useState<number | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchLead, setSearchLead] = useState("");
  const [searchConsultant, setSearchConsultant] = useState("");

  // Query active SLAs with filter
  const { data: activeLeads = [], isLoading: slasLoading } = useActiveSla(selectedSystem);

  // Query current checked-in queue with filter
  const { data: queueList = [], isLoading: queueLoading } = useQueueStatus(selectedSystem);

  // Query all users to map extra details (like phone number)
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<UserDto[]>({
    queryKey: ["auth", "users"],
    queryFn: () => authService.getUsers(),
  });

  const assignMutation = useManualAssign();

  const isLoading = slasLoading || queueLoading || usersLoading;

  // Enrich checked-in consultants with details from auth list
  const enrichedConsultants = queueList.map((queueItem) => {
    const userDetail = allUsers.find(
      (u) => String(u.id).toLowerCase() === String(queueItem.consultantId).toLowerCase()
    );
    return {
      ...queueItem,
      fullName: userDetail?.fullName || queueItem.consultantName || "Tư vấn viên",
      userName: userDetail?.userName || "",
      mobile: userDetail?.mobile || "—",
    };
  });

  // Filter lists based on search queries
  const filteredLeads = activeLeads.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(searchLead.toLowerCase())
  );

  const filteredConsultants = enrichedConsultants.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchConsultant.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchConsultant.toLowerCase())
  );

  const selectedLeadData = activeLeads.find((c) => c.customerId === selectedLead);
  const selectedConsultantData = enrichedConsultants.find(
    (c) => c.consultantId === selectedConsultant
  );

  const handleAssign = async () => {
    if (!selectedLead || !selectedConsultant || !user) return;
    try {
      await assignMutation.mutateAsync({
        customerId: selectedLead,
        assigneeId: selectedConsultant,
        assignedById: user.id,
        note: "Chuyển giao thủ công từ quản trị viên",
      });
      addToast({
        type: "success",
        title: "Giao lead thành công",
        description: `Đã giao ${selectedLeadData?.customerName || "Khách hàng"} cho ${selectedConsultantData?.fullName || "Tư vấn viên"}.`,
      });
      setSelectedLead(null);
      setSelectedConsultant(null);
      setConfirmOpen(false);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Giao lead thất bại",
        description: err.message || "Đã xảy ra lỗi.",
      });
    }
  };

  const getSystemBadgeLabel = (system: string | number | null | undefined) => {
    if (system === null || system === undefined) return "Formal";
    const systemNum = Number(system);
    if (systemNum === TrainingSystem.ShortTerm) return TRAINING_SYSTEM_LABELS[TrainingSystem.ShortTerm];
    if (systemNum === TrainingSystem.Formal) return TRAINING_SYSTEM_LABELS[TrainingSystem.Formal];
    if (systemNum === TrainingSystem.Driving) return TRAINING_SYSTEM_LABELS[TrainingSystem.Driving];
    return String(system);
  };

  return (
    <div className="animate-fade-in relative min-h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="text-sm font-medium text-navy-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Header and Branch Filter Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cyan-400" />
            Giao Lead Thủ Công
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Chọn lead đang active và tư vấn viên để thực hiện chuyển giao công việc
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy-300">Hệ đào tạo:</span>
          <select
            value={selectedSystem ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSystem(val === "" ? undefined : Number(val));
              setSelectedLead(null);
              setSelectedConsultant(null);
            }}
            className="h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          >
            <option value="" className="bg-navy-950 text-navy-100">Tất cả hệ đào tạo</option>
            <option value="1" className="bg-navy-950 text-navy-100">Sơ cấp</option>
            <option value="2" className="bg-navy-950 text-navy-100">Chính quy</option>
            <option value="3" className="bg-navy-950 text-navy-100">Lái xe</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Selection Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-cyan-400" />
                Lead chưa liên hệ ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                <Input
                  placeholder="Tìm lead..."
                  className="pl-10"
                  value={searchLead}
                  onChange={(e) => setSearchLead(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <EmptyState
                    title="Không có lead nào"
                    description="Hiện tại không có lead nào đang chờ xử lý."
                  />
                ) : (
                  filteredLeads.map((lead) => (
                    <button
                      key={lead.customerId}
                      onClick={() => setSelectedLead(lead.customerId)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedLead === lead.customerId
                          ? "border-cyan-500/50 bg-cyan-500/5"
                          : "border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.customerName || "User"} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-navy-200">
                              {lead.customerName || "Ẩn danh"}
                            </p>
                            <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              SLA: {lead.remainingMinutes} phút
                            </p>
                          </div>
                        </div>
                        <Badge variant="cyan">
                          {getSystemBadgeLabel(lead.trainingSystem)}
                        </Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultant Selection Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                Tư vấn viên ({filteredConsultants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                <Input
                  placeholder="Tìm tư vấn viên..."
                  className="pl-10"
                  value={searchConsultant}
                  onChange={(e) => setSearchConsultant(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredConsultants.length === 0 ? (
                  <EmptyState
                    title="Không có tư vấn viên"
                    description="Không tìm thấy tư vấn viên nào trực tuyến."
                  />
                ) : (
                  filteredConsultants.map((consultant) => (
                    <button
                      key={consultant.consultantId}
                      onClick={() => setSelectedConsultant(consultant.consultantId)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedConsultant === consultant.consultantId
                          ? "border-cyan-500/50 bg-cyan-500/5"
                          : "border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={consultant.fullName || "User"} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-navy-200">
                              {consultant.fullName}
                            </p>
                            <p className="text-xs text-navy-500">
                              SĐT: {consultant.mobile}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Load Indicator display */}
                          <Badge variant="outline" className="text-xs text-navy-400 border-navy-700/50 bg-navy-900/30">
                            Tải: {consultant.currentLoad}/{consultant.maxLoad}
                          </Badge>
                          {selectedConsultant === consultant.consultantId && (
                            <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Allocation Confirmation Action bar */}
      {selectedLead && selectedConsultant && (
        <div className="mt-6 p-4 glass rounded-xl flex items-center justify-between animate-slide-up border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar name={selectedLeadData?.customerName || ""} size="sm" />
              <span className="text-sm font-medium text-navy-200">
                {selectedLeadData?.customerName}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-400" />
            <div className="flex items-center gap-2">
              <Avatar name={selectedConsultantData?.fullName || ""} size="sm" />
              <span className="text-sm font-medium text-navy-200">
                {selectedConsultantData?.fullName}
              </span>
            </div>
          </div>
          <Button onClick={() => setConfirmOpen(true)}>
            <UserPlus className="h-4 w-4 text-white" />
            Xác nhận giao
          </Button>
        </div>
      )}

      {/* Confirmation Dialog component */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleAssign}
        title="Xác nhận giao lead"
        description={`Bạn có chắc muốn giao lead "${selectedLeadData?.customerName}" cho "${selectedConsultantData?.fullName}"?`}
        confirmLabel="Xác nhận giao"
        variant="warning"
        isLoading={assignMutation.isPending}
      />
    </div>
  );
}
