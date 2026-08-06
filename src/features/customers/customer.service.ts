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

// TODO(backend): Driving.API chưa có endpoint tạo customer
export const drivingService = {
  async createCustomer(_data: CreateCustomerCommand): Promise<string> {
    throw new Error("API chưa sẵn sàng: Backend Driving chưa hỗ trợ tạo khách hàng.");
  },
};

export const customerService = {
  async seedCustomers(count: number = 100): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/api/customers/seed-customers", null, {
      params: { count }
    });
    return response.data;
  }
};

