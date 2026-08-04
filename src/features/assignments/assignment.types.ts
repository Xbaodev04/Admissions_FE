// ============================================================
// Assignment types
// ============================================================

import type { AssignmentStatus, SlaStatus } from "@/shared/types/common";

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

export interface ActivityItem {
  id: string;
  type: "lead_created" | "lead_assigned" | "evidence_added" | "sla_warning" | "lead_converted";
  message: string;
  user: string;
  timestamp: string;
}

// ============================================================
// OpenAPI DTOs & Commands for LeadAssignment API
// ============================================================

export interface ActiveSlaDto {
  id: string;
  customerId: string;
  customerName?: string | null;
  trainingSystem?: string | null;
  assigneeId: string;
  assigneeName?: string | null;
  assignedAt: string;
  deadline: string;
  remainingMinutes: number;
  isViolated: boolean;
}

export interface AssignmentReportDto {
  consultantId: string;
  consultantName?: string | null;
  totalAssigned: number;
  slaFulfilled: number;
  slaViolated: number;
  pending: number;
}

export interface ContactEvidenceDto {
  id: string;
  consultantId: string;
  consultantName?: string | null;
  fileUrl?: string | null;
  description?: string | null;
  durationSeconds?: number | null;
  leadStatus: number;
  followStatus: number;
  createdAt: string;
}

export interface CreateContactEvidenceCommand {
  customerId: string;
  consultantId: string;
  fileUrl?: string | null;
  description?: string | null;
  durationSeconds?: number | null;
  leadStatus: number;
  followStatus: number;
}

export interface CustomerAssignmentHistoryDto {
  id: string;
  assigneeId: string;
  assigneeName?: string | null;
  assignedById: string;
  assignmentDate: string;
  reason?: string | null;
  note?: string | null;
}

export interface ManualAssignCommand {
  customerId: string;
  assigneeId: string;
  assignedById: string;
  note?: string | null;
}

export interface QueueStatusDto {
  id: string;
  trainingSystem?: string | null;
  consultantId: string;
  consultantName?: string | null;
  orderIndex: number;
  currentLoad: number;
  maxLoad: number;
  isActive: boolean;
  lastAssignedAt?: string | null;
}

export interface UpdateSlaConfigCommand {
  slaDeadlineMinutes?: number | null;
  defaultManagerId?: string | null;
}

