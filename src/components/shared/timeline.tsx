import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: "success" | "warning" | "error" | "default";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusDotColor = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  default: "bg-cyan-500",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-navy-700" />

      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative flex gap-4 pb-6 last:pb-0",
            "animate-slide-up"
          )}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Dot */}
          <div className="relative z-10 flex-shrink-0 mt-1">
            {item.icon || (
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 border-navy-800 flex items-center justify-center",
                  statusDotColor[item.status || "default"]
                )}
              >
                <div className="h-2 w-2 rounded-full bg-white/80" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-medium text-navy-200">{item.title}</p>
            {item.description && (
              <p className="text-sm text-navy-400 mt-1">{item.description}</p>
            )}
            <p className="text-xs text-navy-500 mt-1">
              {formatDateTime(item.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
