import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types";

// TODO(security): In production, the base URL should come from server-side env variables only.
// NEXT_PUBLIC_ prefix exposes to client — acceptable for API gateway URL.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// Request interceptor — attach JWT token
// ============================================================
// TODO(security): Migrate to HttpOnly cookie-based auth when backend supports it.
// Currently using in-memory token via Zustand store for development.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is retrieved from memory (Zustand store)
    // We dynamically import to avoid circular dependency
    if (typeof window !== "undefined") {
      const token = getTokenFromMemory();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response interceptor — handle errors globally
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear session and redirect
      if (typeof window !== "undefined") {
        clearTokenFromMemory();
        window.location.href = "/login";
      }
    }

    // Map error to consistent format
    const apiError: ApiError = {
      status: status || 500,
      message: getErrorMessage(status, error.response?.data?.message),
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

// ============================================================
// Error message mapping
// ============================================================
function getErrorMessage(
  status: number | undefined,
  serverMessage?: string
): string {
  if (serverMessage) return serverMessage;

  switch (status) {
    case 400:
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
    case 401:
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    case 403:
      return "Bạn không có quyền thực hiện thao tác này.";
    case 404:
      return "Không tìm thấy dữ liệu.";
    case 409:
      return "Dữ liệu đã tồn tại hoặc xung đột.";
    case 422:
      return "Dữ liệu không thể xử lý.";
    case 429:
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
    case 500:
      return "Lỗi hệ thống. Vui lòng thử lại sau.";
    default:
      return "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
}

// ============================================================
// In-memory token management
// TODO(security): Replace with HttpOnly cookie approach
// ============================================================
let _token: string | null = null;

export function setTokenInMemory(token: string): void {
  _token = token;
}

export function getTokenFromMemory(): string | null {
  return _token;
}

export function clearTokenFromMemory(): void {
  _token = null;
}

export default apiClient;
