"use client";

import { cn } from "@/shared/utils/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Đã xảy ra lỗi",
  message = "Không thể tải dữ liệu. Vui lòng thử lại.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-rose-500/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy-200 mb-2">{title}</h3>
      <p className="text-sm text-navy-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      )}
    </div>
  );
}
