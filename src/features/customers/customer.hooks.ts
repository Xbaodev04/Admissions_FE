import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formalService, shorttermService, drivingService, customerService } from "./customer.service";
import type { CreateCustomerCommand } from "./customer.service";
import { assignmentKeys } from "@/features/assignments/assignment.hooks";

type Branch = "formal" | "shortterm" | "driving";

export function useCreateCustomer(branch: Branch) {
  return useMutation({
    mutationFn: (data: CreateCustomerCommand) => {
      switch (branch) {
        case "formal":
          return formalService.createCustomer(data);
        case "shortterm":
          return shorttermService.createCustomer(data);
        case "driving":
          return drivingService.createCustomer(data);
        default:
          throw new Error(`Nhánh đào tạo "${branch}" không hợp lệ.`);
      }
    },
  });
}

export function useSeedCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (count: number) => customerService.seedCustomers(count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
    },
  });
}

