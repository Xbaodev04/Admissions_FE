"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FilterBar, type FilterGroup } from "@/components/shared/filter-bar";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockCustomers, mockConsultants } from "@/lib/mock-data";
import { maskPhone, formatDateTime } from "@/lib/utils";
import { BRANCH_LABELS, type Branch } from "@/types/common";
import type { ColumnDef } from "@tanstack/react-table";
import { History, FileText, Download, Eye } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";

interface HistoryRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  branch: string;
  status: string;
  assignedToName: string;
  assignedAt?: string;
  updatedAt: string;
  notes?: string;
}

const filterGroups: FilterGroup[] = [
  {
    key: "branch",
    label: "Nhánh tuyển sinh",
    options: [
      { value: "formal", label: "Chính quy" },
      { value: "driving", label: "Lái xe" },
      { value: "shortterm", label: "Ngắn hạn" },
    ],
  },
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { value: "new", label: "Mới tạo" },
      { value: "contacted", label: "Đã liên hệ" },
      { value: "qualified", label: "Tiềm năng" },
      { value: "converted", label: "Đã chuyển đổi" },
      { value: "lost", label: "Thất bại / Hủy" },
    ],
  },
];

export default function FormalHistoryPage() {
  const { addToast } = useToast();
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilterValues({});
  };

  const handleExport = () => {
    addToast({
      type: "info",
      title: "Đang xuất báo cáo...",
      description: "File Excel lịch sử tuyển sinh đang được chuẩn bị.",
    });
  };

  // Convert mock customers to history format
  const allRecords: HistoryRecord[] = mockCustomers.map((c) => {
    const consultant = mockConsultants.find((con) => con.id === c.assignedTo);
    return {
      id: c.id,
      customerName: c.name,
      customerPhone: c.phone,
      branch: c.branch,
      status: c.status,
      assignedToName: consultant?.name || "Chưa giao",
      assignedAt: c.createdAt,
      updatedAt: c.updatedAt,
      notes: c.notes,
    };
  });

  const filteredRecords = allRecords.filter((rec) => {
    if (filterValues.branch && rec.branch !== filterValues.branch) return false;
    if (filterValues.status && rec.status !== filterValues.status) return false;
    return true;
  });

  const columns: ColumnDef<HistoryRecord>[] = [
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={record.customerName} size="sm" />
            <div>
              <p className="text-sm font-medium text-navy-200">{record.customerName}</p>
              <p className="text-xs text-navy-500">{maskPhone(record.customerPhone)}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "branch",
      header: "Nhánh",
      cell: ({ row }) => {
        const branch = row.original.branch as Branch;
        return (
          <Badge
            variant={
              branch === "formal"
                ? "cyan"
                : branch === "driving"
                ? "warning"
                : "success"
            }
          >
            {BRANCH_LABELS[branch] || branch}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "assignedToName",
      header: "Tư vấn viên",
      cell: ({ row }) => (
        <span className="text-sm text-navy-300 font-medium">
          {row.original.assignedToName}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật lần cuối",
      cell: ({ row }) => (
        <span className="text-xs text-navy-400">
          {formatDateTime(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <Link href={`/evidence?customer=${row.original.id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-cyan-400">
            <Eye className="h-3.5 w-3.5" />
            Lịch sử
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-100 flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            Lịch sử & Kho lưu trữ Lead
          </h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Tra cứu toàn bộ lịch sử lead, phân công và trạng thái xử lý
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Xuất dữ liệu (Excel)
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        groups={filterGroups}
        values={filterValues}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredRecords}
            searchKey="customerName"
            searchPlaceholder="Tìm kiếm theo tên khách hàng..."
            defaultPageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
