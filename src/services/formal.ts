import apiClient from "@/lib/axios";
import type {
  Customer,
  CreateFormalCustomerRequest,
} from "@/types";
import type { Assignment, QueueItem, SlaItem } from "@/types/assignment";
import type { Evidence } from "@/types/evidence";

export const formalService = {
  async createCustomer(data: CreateFormalCustomerRequest): Promise<Customer> {
    const payload = {
      name: data.name,
      email: data.email || "",
      mobile: data.mobile || data.phone || "",
      address: data.address || "",
      trainingSystem: 2, // Formal
      latestSchool: data.latestSchool || data.highSchool || "",
      graduationYear: data.graduationYear,
      parentMobile: data.parentMobile || data.parentPhone || "",
      parentName: data.parentName || "",
      createdBy: data.createdBy || "00000000-0000-0000-0000-000000000000",
      source: typeof data.source === "number" ? data.source : 1,
    };
    const response = await apiClient.post<string | { id: string }>(
      "/api/formal/customer",
      payload
    );
    const id =
      typeof response.data === "string"
        ? response.data
        : response.data?.id || "new-id";

    return {
      id,
      name: data.name,
      phone: data.mobile || data.phone || "",
      email: data.email || "",
      address: data.address || "",
      branch: "formal",
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async assignCustomer(
    customerId: string,
    consultantId: string,
    assignedById: string = "00000000-0000-0000-0000-000000000000",
    note?: string
  ): Promise<void> {
    await apiClient.post("/api/formal/customer/assign", {
      customerId,
      assigneeId: consultantId,
      assignedById,
      note: note || "",
    });
  },

  async getQueue(): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>(
      "/api/formal/assignment/queue"
    );
    return response.data;
  },

  async getActiveSla(): Promise<SlaItem[]> {
    const response = await apiClient.get<SlaItem[]>(
      "/api/formal/assignment/sla/active"
    );
    return response.data;
  },

  async getHistory(customerId: string): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>(
      `/api/formal/assignment/history/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },

  async getEvidence(customerId: string): Promise<Evidence[]> {
    const response = await apiClient.get<Evidence[]>(
      `/api/formal/assignment/evidence/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },
};
