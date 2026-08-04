import * as React from "react";
import { cn } from "@/shared/utils/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-navy-800/50 px-3 py-2 text-sm text-navy-100 placeholder:text-navy-500 transition-all duration-200",
          "border-navy-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
