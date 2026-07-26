"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toast";
import { EmptyState } from "@/components/shared/empty-state";
import { mockCustomers, mockConsultants } from "@/lib/mock-data";
import { maskPhone, formatDateTime } from "@/lib/utils";
import { BRANCH_LABELS, type Branch } from "@/types/common";
import {
  Search,
  UserPlus,
  Users,
  ArrowRight,
  Filter,
  Clock,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

export default function AssignmentPage() {
  const { addToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchLead, setSearchLead] = useState("");
  const [searchConsultant, setSearchConsultant] = useState("");

  const unassignedLeads = mockCustomers.filter(
    (c) =>
      !c.assignedTo &&
      c.name.toLowerCase().includes(searchLead.toLowerCase())
  );

  const filteredConsultants = mockConsultants.filter(
    (c) =>
      c.isActive &&
      c.name.toLowerCase().includes(searchConsultant.toLowerCase())
  );

  const selectedLeadData = mockCustomers.find((c) => c.id === selectedLead);
  const selectedConsultantData = mockConsultants.find(
    (c) => c.id === selectedConsultant
  );

  const handleAssign = async () => {
    if (!selectedLead || !selectedConsultant) return;
    setIsAssigning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast({
        type: "success",
        title: "Giao lead thành công",
        description: `Đã giao ${selectedLeadData?.name} cho ${selectedConsultantData?.name}.`,
      });
      setSelectedLead(null);
      setSelectedConsultant(null);
      setConfirmOpen(false);
    } catch {
      addToast({
        type: "error",
        title: "Giao lead thất bại",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-cyan-400" />
          Giao Lead
        </h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Chọn lead và tư vấn viên để giao việc
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Selection */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-cyan-400" />
                Lead chưa giao ({unassignedLeads.length})
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
                {unassignedLeads.length === 0 ? (
                  <EmptyState
                    title="Không có lead nào"
                    description="Tất cả lead đã được giao cho tư vấn viên."
                  />
                ) : (
                  unassignedLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedLead === lead.id
                          ? "border-cyan-500/50 bg-cyan-500/5"
                          : "border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-navy-200">
                              {lead.name}
                            </p>
                            <p className="text-xs text-navy-500">
                              {maskPhone(lead.phone)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            lead.branch === "formal"
                              ? "cyan"
                              : lead.branch === "driving"
                              ? "warning"
                              : "success"
                          }
                        >
                          {BRANCH_LABELS[lead.branch as Branch]}
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
                {filteredConsultants.map((consultant) => {
                  const loadPercent =
                    (consultant.currentLoad / consultant.maxLoad) * 100;
                  const isOverloaded = loadPercent >= 80;

                  return (
                    <button
                      key={consultant.id}
                      onClick={() => setSelectedConsultant(consultant.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedConsultant === consultant.id
                          ? "border-cyan-500/50 bg-cyan-500/5"
                          : "border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={consultant.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-navy-200">
                              {consultant.name}
                            </p>
                            <p className="text-xs text-navy-500">
                              {consultant.branch}
                            </p>
                          </div>
                        </div>
                        {selectedConsultant === consultant.id && (
                          <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-navy-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {consultant.currentLoad}/{consultant.maxLoad} lead
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {consultant.completedThisMonth} tháng này
                        </span>
                        {consultant.lastAssignedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Gần nhất: {formatDateTime(consultant.lastAssignedAt)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverloaded ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(loadPercent, 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Action */}
      {selectedLead && selectedConsultant && (
        <div className="mt-6 p-4 glass rounded-xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar name={selectedLeadData?.name || ""} size="sm" />
              <span className="text-sm font-medium text-navy-200">
                {selectedLeadData?.name}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-400" />
            <div className="flex items-center gap-2">
              <Avatar name={selectedConsultantData?.name || ""} size="sm" />
              <span className="text-sm font-medium text-navy-200">
                {selectedConsultantData?.name}
              </span>
            </div>
          </div>
          <Button onClick={() => setConfirmOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Giao Lead
          </Button>
        </div>
      )}

      {/* Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleAssign}
        title="Xác nhận giao lead"
        description={`Bạn có chắc muốn giao lead "${selectedLeadData?.name}" cho "${selectedConsultantData?.name}"?`}
        confirmLabel="Xác nhận giao"
        variant="warning"
        isLoading={isAssigning}
      />
    </div>
  );
}
