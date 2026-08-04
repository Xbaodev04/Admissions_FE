// ============================================================
// Evidence types
// ============================================================

export interface Evidence {
  id: string;
  customerId: string;
  customerName: string;
  consultantId: string;
  consultantName: string;
  type: "call" | "email" | "meeting" | "document" | "note";
  status: string;
  notes: string;
  callDuration?: number;
  fileName?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface CreateEvidenceRequest {
  customerId: string;
  consultantId?: string;
  type: Evidence["type"] | number;
  status?: string;
  notes?: string;
  callDuration?: number;
  file?: File;
  fileUrl?: string;
  description?: string;
  durationSeconds?: number;
  oldStatusValue?: string;
  newStatusValue?: string;
  branch?: "formal" | "shortterm" | "driving";
}

export const EVIDENCE_TYPE_LABELS: Record<Evidence["type"], string> = {
  call: "Cuộc gọi",
  email: "Email",
  meeting: "Gặp mặt",
  document: "Tài liệu",
  note: "Ghi chú",
};
