import apiClient from "@/lib/axios";
import type {
  Customer,
  CreateDrivingCustomerRequest,
} from "@/types";
import type { Assignment, QueueItem, SlaItem } from "@/types/assignment";
import type { Evidence } from "@/types/evidence";

export const drivingService = {
  async createCustomer(data: CreateDrivingCustomerRequest): Promise<Customer> {
    const payload = {
      name: data.name,
      email: data.email || "",
      mobile: data.mobile || data.phone || "",
      address: data.address || "",
      trainingSystem: 3, // Driving
      createdBy: data.createdBy || "00000000-0000-0000-0000-000000000000",
      source: typeof data.source === "number" ? data.source : 1,
      cccd: data.cccd || data.identityNumber || "",
      birthDate: data.birthDate || data.dateOfBirth,
    };
    const response = await apiClient.post<string | { id: string }>(
      "/api/driving/customer",
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
      branch: "driving",
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
    await apiClient.post("/api/driving/customer/assign", {
      customerId,
      assigneeId: consultantId,
      assignedById,
      note: note || "",
    });
  },

  async getQueue(): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>(
      "/api/driving/assignment/queue"
    );
    return response.data;
  },

  async getActiveSla(): Promise<SlaItem[]> {
    const response = await apiClient.get<SlaItem[]>(
      "/api/driving/assignment/sla/active"
    );
    return response.data;
  },

  async getHistory(customerId: string): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>(
      `/api/driving/assignment/history/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },

  async getEvidence(customerId: string): Promise<Evidence[]> {
    const response = await apiClient.get<Evidence[]>(
      `/api/driving/assignment/evidence/${encodeURIComponent(customerId)}`
    );
    return response.data;
  },
};
