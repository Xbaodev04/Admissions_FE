import apiClient from "@/shared/api/client";
import type {
  ActiveSlaDto,
  AssignmentReportDto,
  ContactEvidenceDto,
  CreateContactEvidenceCommand,
  CustomerAssignmentHistoryDto,
  ManualAssignCommand,
  QueueStatusDto,
  MyQueueStatusDto,
  UpdateSlaConfigCommand,
} from "./assignment.types";

export const assignmentService = {
  async checkIn(): Promise<void> {
    await apiClient.post("/api/Assignment/check-in");
  },

  async checkOut(): Promise<void> {
    await apiClient.post("/api/Assignment/check-out");
  },

  async manualAssign(data: ManualAssignCommand): Promise<void> {
    await apiClient.post("/api/Assignment/manual-assign", data);
  },

  // TODO(backend): Endpoint PUT /api/Assignment/config/sla chưa tồn tại ở backend
  async updateSlaConfig(data: UpdateSlaConfigCommand): Promise<void> {
    throw new Error("API chưa sẵn sàng: Backend chưa hỗ trợ cập nhật cấu hình SLA.");
  },

  async getReport(fromDate?: string, toDate?: string): Promise<AssignmentReportDto[]> {
    const params: Record<string, string> = {};
    if (fromDate) params.FromDate = fromDate;
    if (toDate) params.ToDate = toDate;
    const response = await apiClient.get<AssignmentReportDto[]>("/api/Assignment/report", { params });
    return response.data;
  },

  async getHistory(customerId: string): Promise<CustomerAssignmentHistoryDto[]> {
    const response = await apiClient.get<CustomerAssignmentHistoryDto[]>(
      `/api/Assignment/history/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },

  async getQueue(trainingSystem?: number): Promise<QueueStatusDto[]> {
    const params = trainingSystem !== undefined ? { trainingSystem } : {};
    const response = await apiClient.get<QueueStatusDto[]>("/api/Assignment/queue", { params });
    return response.data;
  },

  async getQueueMe(): Promise<QueueStatusDto | null> {
    const response = await apiClient.get<QueueStatusDto[]>("/api/Assignment/queue/me");
    if (Array.isArray(response.data)) {
      return response.data[0] || null;
    }
    return (response.data as QueueStatusDto) || null;
  },

  async getActiveSla(trainingSystem?: number): Promise<ActiveSlaDto[]> {
    const params = trainingSystem !== undefined ? { trainingSystem } : {};
    const response = await apiClient.get<ActiveSlaDto[]>("/api/Assignment/sla/active", { params });
    return response.data;
  },

  async getMyActiveSla(): Promise<ActiveSlaDto[]> {
    const response = await apiClient.get<ActiveSlaDto[]>("/api/Assignment/sla/me");
    return response.data;
  },

  async getEvidence(customerId: string): Promise<ContactEvidenceDto[]> {
    const response = await apiClient.get<ContactEvidenceDto[]>(
      `/api/Assignment/evidence/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },

  async createContactEvidence(data: CreateContactEvidenceCommand): Promise<void> {
    await apiClient.post("/api/Assignment/evidence", data);
  },
};
