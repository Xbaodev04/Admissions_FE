"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/shared/ui/components/ui/dialog";
import { useToast } from "@/shared/ui/components/shared/toast";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
import { type UserDto } from "@/features/auth/auth.types";
import { useActiveSla, useQueueStatus, useManualAssign } from "@/features/assignments/assignment.hooks";
import { MyQueueCard } from "@/features/assignments/components/my-queue-card";
import { TrainingSystem, TRAINING_SYSTEM_LABELS } from "@/shared/contracts/api-contracts";
import {
  Search,
  UserPlus,
  Users,
  ArrowRight,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
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

  // Filter unassigned leads (or violated leads needing reassignment)
  const unassignedLeads = useMemo(() => {
    return activeLeads.filter((lead) => {
      const isUnassigned =
        !lead.assigneeId ||
        lead.assigneeId === "00000000-0000-0000-0000-000000000000" ||
        lead.assigneeName === "Chưa phân công";
      return isUnassigned || lead.isViolated;
    });
  }, [activeLeads]);

  const filteredLeads = useMemo(() => {
    return unassignedLeads.filter((c) =>
      c.customerName?.toLowerCase().includes(searchLead.toLowerCase())
    );
  }, [unassignedLeads, searchLead]);

  const filteredConsultants = enrichedConsultants.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchConsultant.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchConsultant.toLowerCase())
  );

  const handleSelectLead = (customerId: string) => {
    setSelectedLead(customerId);
    if (selectedConsultant) {
      setConfirmOpen(true);
    }
  };

  const handleSelectConsultant = (consultantId: string) => {
    setSelectedConsultant(consultantId);
    if (selectedLead) {
      setConfirmOpen(true);
    }
  };

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
    if (system === null || system === undefined) return "Chính quy";
    if (typeof system === "string") {
      const lower = system.toLowerCase();
      if (lower.includes("formal")) return "Chính quy";
      if (lower.includes("shortterm") || lower.includes("short_term") || lower.includes("short")) return "Sơ cấp";
      if (lower.includes("driving")) return "Lái xe";
    }
    const systemNum = Number(system);
    if (systemNum === TrainingSystem.ShortTerm || systemNum === 1) return "Sơ cấp";
    if (systemNum === TrainingSystem.Formal || systemNum === 2) return "Chính quy";
    if (systemNum === TrainingSystem.Driving || systemNum === 3) return "Lái xe";
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cyan-400" />
            Giao Lead & Hàng Đợi Phân Bổ
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Quản lý hàng đợi nhận lead, check-in và thực hiện chuyển giao lead công việc
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
      </div>

      <div className="mb-6">
        <MyQueueCard trainingSystem={selectedSystem} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="border border-slate-200 dark:border-navy-700/30 bg-white dark:bg-navy-800/20 backdrop-blur-md">
            <CardHeader className="border-b border-slate-100 dark:border-navy-700/30 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Users className="h-4 w-4 text-cyan-500" />
                Lead chưa được giao ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                <Input
                  placeholder="Tìm lead chưa phân công..."
                  className="pl-10"
                  value={searchLead}
                  onChange={(e) => setSearchLead(e.target.value)}
                />
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredLeads.length === 0 ? (
                  <EmptyState
                    title="Không có lead chưa giao"
                    description="Tất cả khách hàng đã được phân công cho nhân viên."
                  />
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLead === lead.customerId;
                    return (
                      <button
                        key={lead.customerId}
                        onClick={() => handleSelectLead(lead.customerId)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500/15 dark:bg-cyan-500/20 shadow-md shadow-cyan-500/10 ring-2 ring-cyan-500/50"
                            : "border-slate-200 dark:border-navy-700/50 bg-white dark:bg-navy-900/40 hover:border-cyan-400/60 hover:bg-cyan-500/5 dark:hover:bg-navy-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={lead.customerName || "User"} size="sm" />
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? "text-cyan-600 dark:text-cyan-300" : "text-slate-800 dark:text-navy-100"}`}>
                                {lead.customerName || "Ẩn danh"}
                              </p>
                              {lead.isViolated || lead.remainingMinutes <= 0 ? (
                                <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-0.5 font-bold">
                                  <AlertCircle className="h-3 w-3 text-rose-500" />
                                  Vi phạm SLA (Cần thu hồi & giao lại)
                                </p>
                              ) : (
                                <p className="text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1 mt-0.5 font-medium">
                                  <Clock className="h-3 w-3" />
                                  SLA: {lead.remainingMinutes} phút
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            {lead.isViolated || lead.remainingMinutes <= 0 ? (
                              <Badge variant="destructive" className="font-semibold">
                                Thu hồi & Giao lại
                              </Badge>
                            ) : (
                              <Badge variant="cyan" className="font-semibold">
                                {getSystemBadgeLabel(lead.trainingSystem)}
                              </Badge>
                            )}
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-cyan-500 flex-shrink-0 animate-scale-in" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-slate-200 dark:border-navy-700/30 bg-white dark:bg-navy-800/20 backdrop-blur-md">
            <CardHeader className="border-b border-slate-100 dark:border-navy-700/30 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Briefcase className="h-4 w-4 text-emerald-500" />
                Tư vấn viên ({filteredConsultants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                <Input
                  placeholder="Tìm tư vấn viên..."
                  className="pl-10"
                  value={searchConsultant}
                  onChange={(e) => setSearchConsultant(e.target.value)}
                />
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredConsultants.length === 0 ? (
                  <EmptyState
                    title="Không có tư vấn viên"
                    description="Không tìm thấy tư vấn viên nào trực tuyến."
                  />
                ) : (
                  filteredConsultants.map((consultant) => {
                    const isSelected = selectedConsultant === consultant.consultantId;
                    return (
                      <button
                        key={consultant.consultantId}
                        onClick={() => handleSelectConsultant(consultant.consultantId)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/20 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/50"
                            : "border-slate-200 dark:border-navy-700/50 bg-white dark:bg-navy-900/40 hover:border-emerald-400/60 hover:bg-emerald-500/5 dark:hover:bg-navy-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={consultant.fullName || "User"} size="sm" />
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? "text-emerald-600 dark:text-emerald-300" : "text-slate-800 dark:text-navy-100"}`}>
                                {consultant.fullName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-navy-400 font-medium">
                                SĐT: {consultant.mobile}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Badge variant="outline" className="text-xs text-slate-600 dark:text-navy-300 border-slate-300 dark:border-navy-700/50 bg-slate-100 dark:bg-navy-900/40 font-semibold">
                              Tải: {consultant.currentLoad}/{consultant.maxLoad}
                            </Badge>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 animate-scale-in" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogClose onClose={() => setConfirmOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
            <UserPlus className="h-5 w-5 text-cyan-500" />
            Xác nhận Phân công Lead thủ công
          </DialogTitle>
          <DialogDescription>
            Vui lòng kiểm tra lại thông tin chuyển giao trước khi xác nhận.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700/40">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Avatar name={selectedLeadData?.customerName || "Lead"} size="md" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedLeadData?.customerName || "Ẩn danh"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="cyan" className="text-xs font-semibold">
                    {getSystemBadgeLabel(selectedLeadData?.trainingSystem)}
                  </Badge>
                  <span className="text-xs text-rose-500 font-medium">
                    SLA: {selectedLeadData?.remainingMinutes}p
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-2 rounded-full bg-cyan-500/10 text-cyan-500 my-1 sm:my-0">
              <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Avatar name={selectedConsultantData?.fullName || "User"} size="md" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedConsultantData?.fullName || "Tư vấn viên"}
                </p>
                <p className="text-xs text-slate-500 dark:text-navy-400 mt-1 font-medium">
                  SĐT: {selectedConsultantData?.mobile || "—"} • Tải: {selectedConsultantData?.currentLoad}/{selectedConsultantData?.maxLoad}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setConfirmOpen(false)}
            disabled={assignMutation.isPending}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            isLoading={assignMutation.isPending}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold gap-2 shadow-md shadow-cyan-600/20"
          >
            <UserPlus className="h-4 w-4" />
            Xác nhận giao Lead
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
