"use client";

import { Button } from "@/shared/ui/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/shared/ui/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogClose onClose={onClose} />
      <DialogHeader>
        <div className="flex items-center gap-3">
          {variant !== "default" && (
            <div
              className={
                variant === "danger"
                  ? "rounded-full bg-rose-500/10 p-2"
                  : "rounded-full bg-amber-500/10 p-2"
              }
            >
              <AlertTriangle
                className={
                  variant === "danger"
                    ? "h-5 w-5 text-rose-400"
                    : "h-5 w-5 text-amber-400"
                }
              />
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
        </div>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "destructive" : "default"}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
