"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Button } from "@/shared/ui/components/ui/button";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { Input } from "@/shared/ui/components/ui/input";
import { DataTable } from "@/shared/ui/components/shared/data-table";
import { formatDateTime } from "@/shared/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerAssignmentHistoryDto } from "@/features/assignments/assignment.types";
import { History, Clock, Search, Download } from "lucide-react";
import { useToast } from "@/shared/ui/components/shared/toast";
import { useAssignmentHistory, useActiveSla } from "@/features/assignments/assignment.hooks";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";

function FormalHistoryContent() {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const customerIdParam = searchParams.get("customerId") || "";
  const [searchId, setSearchId] = useState(customerIdParam);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerIdParam);

  // Sync state if query param changes
  useEffect(() => {
    setSearchId(customerIdParam);
    setSelectedCustomerId(customerIdParam);
  }, [customerIdParam]);

  // Fetch history using React Query hook
  const { data: assignments = [], isLoading } = useAssignmentHistory(selectedCustomerId || null);
  
  // Fetch active SLA leads for quick selection dropdown
  const { data: activeSlas = [] } = useActiveSla();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    params.set("customerId", searchId.trim());
    router.push(`${pathname}?${params.toString()}`);
    setSelectedCustomerId(searchId.trim());
  };

  const handleSelectQuickLead = (val: string) => {
    setSearchId(val);
    setSelectedCustomerId(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("customerId", val);
    } else {
      params.delete("customerId");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    addToast({
      type: "info",
      title: "Đang xuất báo cáo...",
      description: "File Excel lịch sử tuyển sinh đang được chuẩn bị.",
    });
  };

  const columns: ColumnDef<CustomerAssignmentHistoryDto>[] = [
    {
      accessorKey: "assigneeName",
      header: "Tư vấn viên (Người nhận)",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={record.assigneeName || "User"} size="sm" />
            <span className="text-sm font-medium text-navy-200">{record.assigneeName || "Ẩn danh"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Lý do giao",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.reason || "Phân bổ tự động"}
        </Badge>
      ),
    },
    {
      accessorKey: "assignmentDate",
      header: "Ngày giao",
      cell: ({ row }) => (
        <span className="text-xs text-navy-400 flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-navy-500" />
          {formatDateTime(row.original.assignmentDate)}
        </span>
      ),
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => (
        <span className="text-sm text-navy-300">
          {row.original.note || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            Lịch sử chăm sóc Lead
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Tra cứu toàn bộ lịch sử phân công và trạng thái xử lý của khách hàng
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2" disabled={!selectedCustomerId}>
          <Download className="h-4 w-4" />
          Xuất dữ liệu (Excel)
        </Button>
      </div>

      {/* Customer Lookup & Quick Select Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct lookup by Customer ID */}
            <form onSubmit={handleSearch} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-navy-400 uppercase">Tra cứu trực tiếp bằng ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-500" />
                  <Input
                    placeholder="Nhập mã Khách hàng (Customer ID)..."
                    className="pl-10"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit">Tìm</Button>
            </form>

            {/* Quick select dropdown of active SLAs */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-navy-400 uppercase">Chọn nhanh từ danh sách SLA</label>
              <select
                className="w-full h-10 rounded-md border border-navy-700/50 bg-navy-800/50 px-3 py-2 text-sm text-navy-100 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                value={selectedCustomerId}
                onChange={(e) => handleSelectQuickLead(e.target.value)}
              >
                <option value="" className="bg-navy-900 text-navy-400">
                  -- Chọn khách hàng đang chạy SLA --
                </option>
                {activeSlas.map((sla) => (
                  <option key={sla.customerId} value={sla.customerId} className="bg-navy-950 text-navy-100">
                    {sla.customerName} ({sla.trainingSystem || "Formal"})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-4 relative min-h-[300px]">
          {!selectedCustomerId ? (
            <EmptyState
              title="Vui lòng chọn khách hàng"
              description="Để xem lịch sử giao việc, hãy chọn khách hàng từ danh sách SLA hoặc nhập Customer ID để tra cứu."
              icon={<Search className="h-8 w-8 text-navy-500" />}
            />
          ) : isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm font-medium text-navy-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : assignments.length === 0 ? (
            <EmptyState
              title="Không có lịch sử"
              description="Khách hàng này chưa có lịch sử giao việc nào."
              icon={<History className="h-8 w-8 text-navy-500" />}
            />
          ) : (
            <DataTable
              columns={columns}
              data={assignments}
              searchKey="assigneeName"
              searchPlaceholder="Tìm theo tên tư vấn viên..."
              defaultPageSize={10}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FormalHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormalHistoryContent />
    </Suspense>
  );
}


