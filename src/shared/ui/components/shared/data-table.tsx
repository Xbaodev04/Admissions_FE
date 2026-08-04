"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/shared/ui/components/ui/button";
import { Input } from "@/shared/ui/components/ui/input";
import { Select } from "@/shared/ui/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Tìm kiếm...",
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search & Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchKey ? (
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-10 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
        ) : (
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
        )}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Tổng: <span className="font-semibold text-slate-700 dark:text-slate-200">{table.getFilteredRowModel().rows.length}</span> bản ghi
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#154a7c] dark:bg-slate-800 text-xs text-white dark:text-slate-300 uppercase tracking-wider font-semibold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-5 py-3.5 select-none",
                          canSort && "cursor-pointer hover:text-white/80 transition-colors"
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <ArrowUpDown className="h-3.5 w-3.5 text-white/50" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 even:bg-slate-50/50 dark:even:bg-slate-800/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-500 dark:text-slate-400"
                  >
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            options={pageSizeOptions.map((size) => ({
              value: String(size),
              label: `${size} dòng`,
            }))}
            className="w-24 h-8 text-xs py-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <span>
            Trang <strong className="text-slate-800 dark:text-slate-200">{table.getState().pagination.pageIndex + 1}</strong> /{" "}
            <strong className="text-slate-800 dark:text-slate-200">{table.getPageCount() || 1}</strong>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
