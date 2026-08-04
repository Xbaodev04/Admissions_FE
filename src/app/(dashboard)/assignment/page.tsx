"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { ConfirmDialog } from "@/shared/ui/components/shared/confirm-dialog";
import { useToast } from "@/shared/ui/components/shared/toast";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import { formatDateTime } from "@/shared/utils/utils";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
import { assignmentService } from "@/features/assignments/assignment.service";
import type { UserDto } from "@/features/auth/auth.types";
import type { ActiveSlaDto } from "@/features/assignments/assignment.types";
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
  
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLead, setSearchLead] = useState("");
  const [searchConsultant, setSearchConsultant] = useState("");

  const [activeLeads, setActiveLeads] = useState<ActiveSlaDto[]>([]);
  const [consultants, setConsultants] = useState<UserDto[]>([]);

  const fetchAssignmentData = async () => {
    setIsLoading(true);
    try {
      // Fetch consultants (role 1)
      const allUsers = await authService.getUsers();
      const filteredConsultants = allUsers.filter((u) => u.role === 1);
      setConsultants(filteredConsultants);

      // Fetch active SLAs (leads currently assigned but not contacted)
      const slas = await assignmentService.getActiveSla();
      setActiveLeads(slas);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, []);

  const filteredLeads = activeLeads.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(searchLead.toLowerCase())
  );

  const filteredConsultants = consultants.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(searchConsultant.toLowerCase())
  );

  const selectedLeadData = activeLeads.find((c) => c.customerId === selectedLead);
  const selectedConsultantData = consultants.find(
    (c) => c.id === selectedConsultant
  );

  const handleAssign = async () => {
    if (!selectedLead || !selectedConsultant || !user) return;
    setIsAssigning(true);
    try {
      await assignmentService.manualAssign({
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
      await fetchAssignmentData();
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Giao lead thất bại",
        description: err.message || "Đã xảy ra lỗi.",
      });
    } finally {
      setIsAssigning(false);
    }
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

      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-cyan-400" />
          Giao Lead Thủ Công
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Chọn lead đang active và tư vấn viên để thực hiện chuyển giao công việc
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Selection */}
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
                          {lead.trainingSystem || "Formal"}
                        </Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultant Selection */}
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
                      key={consultant.id}
                      onClick={() => setSelectedConsultant(consultant.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedConsultant === consultant.id
                          ? "border-cyan-500/50 bg-cyan-500/5"
                          : "border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={consultant.fullName || "User"} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-navy-200">
                              {consultant.fullName || consultant.userName}
                            </p>
                            <p className="text-xs text-navy-500">
                              SĐT: {consultant.mobile || "—"}
                            </p>
                          </div>
                        </div>
                        {selectedConsultant === consultant.id && (
                          <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Action */}
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
            <UserPlus className="h-4 w-4" />
            Xác nhận giao
          </Button>
        </div>
      )}

      {/* Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleAssign}
        title="Xác nhận giao lead"
        description={`Bạn có chắc muốn giao lead "${selectedLeadData?.customerName}" cho "${selectedConsultantData?.fullName}"?`}
        confirmLabel="Xác nhận giao"
        variant="warning"
        isLoading={isAssigning}
      />
    </div>
  );
}

