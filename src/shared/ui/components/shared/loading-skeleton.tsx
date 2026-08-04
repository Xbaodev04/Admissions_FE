import { cn } from "@/shared/utils/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function Skeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("skeleton rounded-lg", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-navy-700/50 bg-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-xl border border-navy-700/50 overflow-hidden">
        <div className="p-4 bg-navy-800/30 border-b border-navy-700/50">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-b border-navy-700/30 flex gap-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
