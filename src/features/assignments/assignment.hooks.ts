import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "./assignment.service";
import type {
  ActiveSlaDto,
  AssignmentReportDto,
  CustomerAssignmentHistoryDto,
  ContactEvidenceDto,
  ManualAssignCommand,
  QueueStatusDto,
  MyQueueStatusDto,
  CreateContactEvidenceCommand,
} from "./assignment.types";

// ============================================================
// Query Keys
// ============================================================
export const assignmentKeys = {
  all: ["assignment"] as const,
  activeSla: (trainingSystem?: number) =>
    [...assignmentKeys.all, "sla", "active", trainingSystem] as const,
  myActiveSla: () =>
    [...assignmentKeys.all, "sla", "me"] as const,
  queue: (trainingSystem?: number) =>
    [...assignmentKeys.all, "queue", trainingSystem] as const,
  queueMe: () =>
    [...assignmentKeys.all, "queue", "me"] as const,
  report: (fromDate?: string, toDate?: string) =>
    [...assignmentKeys.all, "report", fromDate, toDate] as const,
  history: (customerId: string) =>
    [...assignmentKeys.all, "history", customerId] as const,
  evidence: (customerId: string) =>
    [...assignmentKeys.all, "evidence", customerId] as const,
};

// ============================================================
// Queries
// ============================================================

export function useActiveSla(trainingSystem?: number) {
  return useQuery<ActiveSlaDto[]>({
    queryKey: assignmentKeys.activeSla(trainingSystem),
    queryFn: () => assignmentService.getActiveSla(trainingSystem),
  });
}

export function useMyActiveSla() {
  return useQuery<ActiveSlaDto[]>({
    queryKey: assignmentKeys.myActiveSla(),
    queryFn: () => assignmentService.getMyActiveSla(),
  });
}

export function useQueueStatus(trainingSystem?: number) {
  return useQuery<QueueStatusDto[]>({
    queryKey: assignmentKeys.queue(trainingSystem),
    queryFn: () => assignmentService.getQueue(trainingSystem),
  });
}

export function useQueueMe(enabled: boolean = true) {
  return useQuery<QueueStatusDto | null>({
    queryKey: assignmentKeys.queueMe(),
    queryFn: () => assignmentService.getQueueMe(),
    enabled,
    retry: 1,
  });
}

export function useAssignmentReport(fromDate?: string, toDate?: string) {
  return useQuery<AssignmentReportDto[]>({
    queryKey: assignmentKeys.report(fromDate, toDate),
    queryFn: () => assignmentService.getReport(fromDate, toDate),
  });
}

export function useAssignmentHistory(customerId: string | null) {
  return useQuery<CustomerAssignmentHistoryDto[]>({
    queryKey: assignmentKeys.history(customerId || ""),
    queryFn: () => assignmentService.getHistory(customerId!),
    enabled: !!customerId,
  });
}

export function useEvidence(customerId: string | null) {
  return useQuery<ContactEvidenceDto[]>({
    queryKey: assignmentKeys.evidence(customerId || ""),
    queryFn: () => assignmentService.getEvidence(customerId!),
    enabled: !!customerId,
  });
}

// ============================================================
// Mutations
// ============================================================

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => assignmentService.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => assignmentService.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
    },
  });
}

export function useManualAssign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManualAssignCommand) => assignmentService.manualAssign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["assignment"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useCreateContactEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContactEvidenceCommand) => assignmentService.createContactEvidence(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      if (variables.customerId) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.evidence(variables.customerId) });
      }
    },
  });
}
