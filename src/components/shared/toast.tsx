"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  error: <XCircle className="h-5 w-5 text-rose-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  info: <Info className="h-5 w-5 text-cyan-400" />,
};

const TOAST_BORDER_COLORS: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  error: "border-l-rose-500",
  warning: "border-l-amber-500",
  info: "border-l-cyan-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto glass rounded-lg border-l-4 p-4 shadow-xl animate-slide-left",
              TOAST_BORDER_COLORS[toast.type]
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {TOAST_ICONS[toast.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-100">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-navy-400 mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-navy-500 hover:text-navy-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
