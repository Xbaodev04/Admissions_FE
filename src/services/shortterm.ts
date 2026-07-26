import apiClient from "@/lib/axios";
import type {
  Customer,
  CreateShortTermCustomerRequest,
} from "@/types";
import type { Assignment, QueueItem, SlaItem } from "@/types/assignment";
import type { Evidence } from "@/types/evidence";

export const shorttermService = {
  async createCustomer(
    data: CreateShortTermCustomerRequest
  ): Promise<Customer> {
    const payload = {
      name: data.name,
      email: data.email || "",
      mobile: data.mobile || data.phone || "",
      address: data.address || "",
      trainingSystem: 1, // ShortTerm
      createdBy: data.createdBy || "00000000-0000-0000-0000-000000000000",
      source: typeof data.source === "number" ? data.source : 1,
      notes: data.notes || `${data.desiredCourse || ""} - ${data.preferredSchedule || ""}`,
    };
    const response = await apiClient.post<string | { id: string }>(
      "/api/shortterm/customer",
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
      branch: "shortterm",
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
    await apiClient.post("/api/shortterm/customer/assign", {
      customerId,
      assigneeId: consultantId,
      assignedById,
      note: note || "",
    });
  },

  async getQueue(): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>(
      "/api/shortterm/assignment/queue"
    );
    return response.data;
  },

  async getActiveSla(): Promise<SlaItem[]> {
    const response = await apiClient.get<SlaItem[]>(
      "/api/shortterm/assignment/sla/active"
    );
    return response.data;
  },

  async getHistory(customerId: string): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>(
      `/api/shortterm/assignment/history/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },

  async getEvidence(customerId: string): Promise<Evidence[]> {
    const response = await apiClient.get<Evidence[]>(
      `/api/shortterm/assignment/evidence/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },
};
