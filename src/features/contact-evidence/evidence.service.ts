import apiClient from "@/shared/api/client";
import type { Evidence, CreateEvidenceRequest } from "@/features/contact-evidence/evidence.types";

export const evidenceService = {
  async createEvidence(data: CreateEvidenceRequest): Promise<Evidence> {
    const branch = data.branch || "formal";

    let typeNum = 3; // Default Note
    if (typeof data.type === "number") {
      typeNum = data.type;
    } else if (data.type === "call") {
      typeNum = 1;
    } else if (data.type === "meeting") {
      typeNum = 4;
    }

    const payload = {
      customerId: data.customerId,
      consultantId: data.consultantId || "00000000-0000-0000-0000-000000000000",
      type: typeNum,
      fileUrl: data.fileUrl || "",
      description: data.description || data.notes || "",
      durationSeconds: data.durationSeconds || data.callDuration || 0,
      oldStatusValue: data.oldStatusValue || "",
      newStatusValue: data.newStatusValue || data.status || "",
    };

    const response = await apiClient.post<string | { id: string }>(
      `/api/${branch}/ContactEvidence`,
      payload
    );
    const id =
      typeof response.data === "string"
        ? response.data
        : response.data?.id || "new-id";

    return {
      id,
      customerId: data.customerId,
      customerName: "",
      consultantId: data.consultantId || "",
      consultantName: "",
      type: typeof data.type === "string" ? data.type : "note",
      status: data.status || "completed",
      notes: data.notes || data.description || "",
      callDuration: data.callDuration || data.durationSeconds,
      fileUrl: data.fileUrl,
      createdAt: new Date().toISOString(),
    };
  },
};
