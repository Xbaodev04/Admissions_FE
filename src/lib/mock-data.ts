/**
 * Mock data for development and UI testing
 * NOTE: This file is used when the backend is not available.
 * Remove or disable in production.
 */

import type { Customer } from "@/types/customer";
import type { Assignment, QueueItem, SlaItem, Consultant } from "@/types/assignment";
import type { Evidence } from "@/types/evidence";
import type { User } from "@/types/auth";

// ============================================================
// Users
// ============================================================
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Nguyễn Văn Admin",
    email: "admin@crm.edu.vn",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "u2",
    name: "Trần Thị Manager",
    email: "manager@crm.edu.vn",
    role: "manager",
    createdAt: "2024-02-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "u3",
    name: "Lê Minh Tư Vấn",
    email: "consultant1@crm.edu.vn",
    role: "consultant",
    createdAt: "2024-03-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "u4",
    name: "Phạm Hồng Tư Vấn",
    email: "consultant2@crm.edu.vn",
    role: "consultant",
    createdAt: "2024-03-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "u5",
    name: "Hoàng Anh Tư Vấn",
    email: "consultant3@crm.edu.vn",
    role: "consultant",
    createdAt: "2024-04-01T00:00:00Z",
    isActive: false,
  },
];

// ============================================================
// Customers / Leads
// ============================================================
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Nguyễn Minh Tuấn",
    phone: "0912345678",
    email: "tuan.nm@gmail.com",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    branch: "formal",
    status: "new",
    source: "Website",
    assignedTo: "u3",
    assignedToName: "Lê Minh Tư Vấn",
    createdAt: "2024-07-20T08:30:00Z",
    updatedAt: "2024-07-20T08:30:00Z",
  },
  {
    id: "c2",
    name: "Trần Thị Hương",
    phone: "0987654321",
    email: "huong.tt@gmail.com",
    branch: "formal",
    status: "contacted",
    source: "Facebook",
    assignedTo: "u4",
    assignedToName: "Phạm Hồng Tư Vấn",
    createdAt: "2024-07-19T10:00:00Z",
    updatedAt: "2024-07-21T14:00:00Z",
  },
  {
    id: "c3",
    name: "Lê Văn Đức",
    phone: "0901234567",
    branch: "driving",
    status: "qualified",
    source: "Giới thiệu",
    assignedTo: "u3",
    assignedToName: "Lê Minh Tư Vấn",
    createdAt: "2024-07-18T09:00:00Z",
    updatedAt: "2024-07-22T16:00:00Z",
  },
  {
    id: "c4",
    name: "Phạm Thanh Hà",
    phone: "0976543210",
    email: "ha.pt@outlook.com",
    branch: "shortterm",
    status: "new",
    source: "Hotline",
    createdAt: "2024-07-22T07:00:00Z",
    updatedAt: "2024-07-22T07:00:00Z",
  },
  {
    id: "c5",
    name: "Võ Minh Quân",
    phone: "0935678901",
    branch: "formal",
    status: "converted",
    source: "Event",
    assignedTo: "u4",
    assignedToName: "Phạm Hồng Tư Vấn",
    createdAt: "2024-07-10T11:00:00Z",
    updatedAt: "2024-07-25T09:00:00Z",
  },
  {
    id: "c6",
    name: "Đặng Thu Thảo",
    phone: "0945678123",
    email: "thao.dt@gmail.com",
    branch: "driving",
    status: "contacted",
    source: "Website",
    assignedTo: "u3",
    assignedToName: "Lê Minh Tư Vấn",
    createdAt: "2024-07-15T13:30:00Z",
    updatedAt: "2024-07-23T10:00:00Z",
  },
  {
    id: "c7",
    name: "Bùi Quốc Bảo",
    phone: "0918765432",
    branch: "shortterm",
    status: "lost",
    source: "Facebook",
    notes: "Không liên lạc được sau 3 lần gọi",
    createdAt: "2024-07-05T08:00:00Z",
    updatedAt: "2024-07-20T17:00:00Z",
  },
  {
    id: "c8",
    name: "Ngô Hoàng Yến",
    phone: "0967890123",
    email: "yen.nh@yahoo.com",
    branch: "formal",
    status: "new",
    source: "Website",
    createdAt: "2024-07-25T15:00:00Z",
    updatedAt: "2024-07-25T15:00:00Z",
  },
];

// ============================================================
// Consultants
// ============================================================
export const mockConsultants: Consultant[] = [
  {
    id: "u3",
    name: "Lê Minh Tư Vấn",
    email: "consultant1@crm.edu.vn",
    currentLoad: 8,
    maxLoad: 15,
    branch: "formal",
    isActive: true,
    lastAssignedAt: "2024-07-22T14:00:00Z",
    completedThisMonth: 12,
  },
  {
    id: "u4",
    name: "Phạm Hồng Tư Vấn",
    email: "consultant2@crm.edu.vn",
    currentLoad: 12,
    maxLoad: 15,
    branch: "formal",
    isActive: true,
    lastAssignedAt: "2024-07-23T09:00:00Z",
    completedThisMonth: 18,
  },
  {
    id: "u5",
    name: "Hoàng Anh Tư Vấn",
    email: "consultant3@crm.edu.vn",
    currentLoad: 0,
    maxLoad: 10,
    branch: "driving",
    isActive: false,
    lastAssignedAt: "2024-07-10T11:00:00Z",
    completedThisMonth: 5,
  },
  {
    id: "u6",
    name: "Vũ Thị Lan",
    email: "consultant4@crm.edu.vn",
    currentLoad: 5,
    maxLoad: 12,
    branch: "shortterm",
    isActive: true,
    lastAssignedAt: "2024-07-24T16:00:00Z",
    completedThisMonth: 9,
  },
];

// ============================================================
// Queue items
// ============================================================
export const mockQueue: QueueItem[] = [
  {
    id: "q1",
    customerId: "c1",
    customerName: "Nguyễn Minh Tuấn",
    customerPhone: "0912345678",
    branch: "formal",
    priority: "high",
    createdAt: "2024-07-20T08:30:00Z",
    waitingTime: "2 ngày",
  },
  {
    id: "q2",
    customerId: "c8",
    customerName: "Ngô Hoàng Yến",
    customerPhone: "0967890123",
    branch: "formal",
    priority: "medium",
    createdAt: "2024-07-25T15:00:00Z",
    waitingTime: "5 giờ",
  },
  {
    id: "q3",
    customerId: "c4",
    customerName: "Phạm Thanh Hà",
    customerPhone: "0976543210",
    branch: "shortterm",
    priority: "low",
    createdAt: "2024-07-22T07:00:00Z",
    waitingTime: "3 ngày",
  },
];

// ============================================================
// SLA items
// ============================================================
export const mockSlaItems: SlaItem[] = [
  {
    id: "sla1",
    customerId: "c1",
    customerName: "Nguyễn Minh Tuấn",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    status: "at_risk",
    deadline: "2024-07-28T00:00:00Z",
    assignedAt: "2024-07-20T08:30:00Z",
    remainingHours: 12,
    contactAttempts: 1,
  },
  {
    id: "sla2",
    customerId: "c2",
    customerName: "Trần Thị Hương",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    status: "on_track",
    deadline: "2024-07-30T00:00:00Z",
    assignedAt: "2024-07-19T10:00:00Z",
    remainingHours: 72,
    contactAttempts: 3,
  },
  {
    id: "sla3",
    customerId: "c6",
    customerName: "Đặng Thu Thảo",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    status: "overdue",
    deadline: "2024-07-23T00:00:00Z",
    assignedAt: "2024-07-15T13:30:00Z",
    remainingHours: -24,
    contactAttempts: 2,
  },
  {
    id: "sla4",
    customerId: "c5",
    customerName: "Võ Minh Quân",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    status: "completed",
    deadline: "2024-07-25T00:00:00Z",
    assignedAt: "2024-07-10T11:00:00Z",
    remainingHours: 0,
    contactAttempts: 5,
  },
];

// ============================================================
// Assignments
// ============================================================
export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    customerId: "c1",
    customerName: "Nguyễn Minh Tuấn",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    branch: "formal",
    status: "active",
    assignedAt: "2024-07-20T08:30:00Z",
  },
  {
    id: "a2",
    customerId: "c2",
    customerName: "Trần Thị Hương",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    branch: "formal",
    status: "active",
    assignedAt: "2024-07-19T10:00:00Z",
  },
  {
    id: "a3",
    customerId: "c5",
    customerName: "Võ Minh Quân",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    branch: "formal",
    status: "completed",
    assignedAt: "2024-07-10T11:00:00Z",
    completedAt: "2024-07-25T09:00:00Z",
  },
  {
    id: "a4",
    customerId: "c3",
    customerName: "Lê Văn Đức",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    branch: "driving",
    status: "active",
    assignedAt: "2024-07-18T09:00:00Z",
  },
  {
    id: "a5",
    customerId: "c6",
    customerName: "Đặng Thu Thảo",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    branch: "driving",
    status: "active",
    assignedAt: "2024-07-15T13:30:00Z",
  },
];

// ============================================================
// Evidence
// ============================================================
export const mockEvidence: Evidence[] = [
  {
    id: "e1",
    customerId: "c1",
    customerName: "Nguyễn Minh Tuấn",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    type: "call",
    status: "contacted",
    notes: "Đã gọi, khách hàng quan tâm ngành CNTT. Hẹn gọi lại thứ 5.",
    callDuration: 300,
    createdAt: "2024-07-21T10:00:00Z",
  },
  {
    id: "e2",
    customerId: "c1",
    customerName: "Nguyễn Minh Tuấn",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    type: "email",
    status: "contacted",
    notes: "Gửi email giới thiệu chương trình đào tạo.",
    createdAt: "2024-07-22T08:30:00Z",
  },
  {
    id: "e3",
    customerId: "c2",
    customerName: "Trần Thị Hương",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    type: "meeting",
    status: "qualified",
    notes: "Gặp tại trường. Khách hàng rất quan tâm, đã nộp hồ sơ.",
    createdAt: "2024-07-21T14:00:00Z",
  },
  {
    id: "e4",
    customerId: "c5",
    customerName: "Võ Minh Quân",
    consultantId: "u4",
    consultantName: "Phạm Hồng Tư Vấn",
    type: "document",
    status: "converted",
    notes: "Đã nhận hồ sơ nhập học hoàn chỉnh.",
    fileName: "ho-so-nhap-hoc.pdf",
    fileUrl: "/files/ho-so-nhap-hoc.pdf",
    createdAt: "2024-07-25T09:00:00Z",
  },
  {
    id: "e5",
    customerId: "c6",
    customerName: "Đặng Thu Thảo",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    type: "call",
    status: "contacted",
    notes: "Gọi lần 1: không nghe máy.",
    callDuration: 0,
    createdAt: "2024-07-16T09:00:00Z",
  },
  {
    id: "e6",
    customerId: "c6",
    customerName: "Đặng Thu Thảo",
    consultantId: "u3",
    consultantName: "Lê Minh Tư Vấn",
    type: "call",
    status: "contacted",
    notes: "Gọi lần 2: khách hàng bận, hẹn gọi lại tuần sau.",
    callDuration: 45,
    createdAt: "2024-07-18T14:00:00Z",
  },
];

// ============================================================
// Dashboard stats
// ============================================================
export const mockDashboardStats = {
  totalLeads: 156,
  activeSla: 23,
  overdueSla: 4,
  unassignedLeads: 12,
  formalLeads: 87,
  drivingLeads: 42,
  shorttermLeads: 27,
  conversionRate: 34.5,
  leadsThisWeek: 18,
  leadsTrend: 12.5, // percentage change
  slaTrend: -8.3,
  overdueTrend: 25.0,
  unassignedTrend: -15.2,
};

// ============================================================
// Activity feed
// ============================================================
export interface ActivityItem {
  id: string;
  type: "lead_created" | "lead_assigned" | "evidence_added" | "sla_warning" | "lead_converted";
  message: string;
  user: string;
  timestamp: string;
}

export const mockActivities: ActivityItem[] = [
  {
    id: "act1",
    type: "lead_created",
    message: "tạo lead mới: Ngô Hoàng Yến (Chính quy)",
    user: "Trần Thị Manager",
    timestamp: "2024-07-25T15:00:00Z",
  },
  {
    id: "act2",
    type: "lead_assigned",
    message: "giao lead Nguyễn Minh Tuấn cho Lê Minh Tư Vấn",
    user: "Trần Thị Manager",
    timestamp: "2024-07-25T14:30:00Z",
  },
  {
    id: "act3",
    type: "evidence_added",
    message: "thêm bằng chứng liên hệ cho Võ Minh Quân",
    user: "Phạm Hồng Tư Vấn",
    timestamp: "2024-07-25T09:00:00Z",
  },
  {
    id: "act4",
    type: "sla_warning",
    message: "SLA sắp hết hạn cho Đặng Thu Thảo",
    user: "Hệ thống",
    timestamp: "2024-07-24T20:00:00Z",
  },
  {
    id: "act5",
    type: "lead_converted",
    message: "chuyển đổi thành công lead Võ Minh Quân",
    user: "Phạm Hồng Tư Vấn",
    timestamp: "2024-07-25T09:00:00Z",
  },
  {
    id: "act6",
    type: "lead_created",
    message: "tạo lead mới: Phạm Thanh Hà (Ngắn hạn)",
    user: "Lê Minh Tư Vấn",
    timestamp: "2024-07-22T07:00:00Z",
  },
];
