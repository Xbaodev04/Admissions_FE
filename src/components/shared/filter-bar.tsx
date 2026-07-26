"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  groups: FilterGroup[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterBar({
  groups,
  values,
  onChange,
  onReset,
  className,
}: FilterBarProps) {
  const hasActiveFilters = Object.values(values).some(Boolean);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 p-3 rounded-xl bg-navy-800/30 border border-navy-700/50",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-navy-400 uppercase tracking-wider mr-1">
        <Filter className="h-4 w-4 text-cyan-400" />
        <span>Bộ lọc:</span>
      </div>

      {groups.map((group) => (
        <div key={group.key} className="flex items-center gap-1.5 min-w-[160px]">
          <Select
            options={[
              { value: "", label: `Tất cả ${group.label.toLowerCase()}` },
              ...group.options,
            ]}
            value={values[group.key] || ""}
            onChange={(e) => onChange(group.key, e.target.value)}
            className="h-8 text-xs py-1"
            aria-label={`Lọc theo ${group.label}`}
          />
        </div>
      ))}

      {hasActiveFilters && onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-auto"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
