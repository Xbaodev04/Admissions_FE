import apiClient from "@/shared/api/client";

export interface CreateCustomerCommand {
  customerId?: string | null;
  fullName?: string | null;
  mobile?: string | null;
  source?: number;
}

export const formalService = {
  async createCustomer(data: CreateCustomerCommand): Promise<string> {
    const response = await apiClient.post<string>("/api/formal/Customers", data);
    return response.data;
  },
};

export const shorttermService = {
  async createCustomer(data: CreateCustomerCommand): Promise<string> {
    const response = await apiClient.post<string>("/api/shortterm/Customers", data);
    return response.data;
  },
};

export const drivingService = {
  async createCustomer(data: CreateCustomerCommand): Promise<string> {
    const response = await apiClient.post<string>("/api/driving/customer", data);
    return response.data;
  },
};

