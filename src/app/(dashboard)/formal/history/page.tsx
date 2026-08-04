"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/components/ui/card";
import { Badge } from "@/shared/ui/components/ui/badge";
import { Button } from "@/shared/ui/components/ui/button";
import { Avatar } from "@/shared/ui/components/ui/avatar";
import { DataTable } from "@/shared/ui/components/shared/data-table";
import { formatDateTime } from "@/shared/utils/utils";
import type { CustomerAssignmentHistoryDto } from "@/features/assignments/assignment.types";
import type { ColumnDef } from "@tanstack/react-table";
import { History, FileText, Download, Search, Clock, User, MessageSquare } from "lucide-react";
import { useToast } from "@/shared/ui/components/shared/toast";
import { assignmentService } from "@/features/assignments/assignment.service";
import { EmptyState } from "@/shared/ui/components/shared/empty-state";

function FormalHistoryContent() {
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState<CustomerAssignmentHistoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");

  useEffect(() => {
    if (!customerId) return;
    
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await assignmentService.getHistory(customerId);
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [customerId]);

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
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Xuất dữ liệu (Excel)
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-4 relative min-h-[300px]">
          {!customerId ? (
            <EmptyState
              title="Vui lòng chọn khách hàng"
              description="Để xem lịch sử giao việc, hãy truyền tham số ?customerId=xxx vào đường dẫn."
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

