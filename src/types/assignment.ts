// ============================================================
// Assignment types
// ============================================================

import type { AssignmentStatus, SlaStatus } from "./common";

export interface Assignment {
  id: string;
  customerId: string;
  customerName: string;
  consultantId: string;
  consultantName: string;
  branch: string;
  status: AssignmentStatus;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface AssignRequest {
  customerId: string;
  consultantId?: string;
  assigneeId?: string;
  assignedById?: string;
  note?: string;
}

export interface QueueItem {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branch: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  waitingTime: string;
}

export interface SlaItem {
  id: string;
  customerId: string;
  customerName: string;
  consultantId: string;
  consultantName: string;
  status: SlaStatus;
  deadline: string;
  assignedAt: string;
  remainingHours: number;
  contactAttempts: number;
}

export interface Consultant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentLoad: number;
  maxLoad: number;
  branch: string;
  isActive: boolean;
  lastAssignedAt?: string;
  completedThisMonth: number;
}
