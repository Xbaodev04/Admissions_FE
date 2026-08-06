import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useQueueStatus } from "./assignment.hooks";

/**
 * Custom hook to determine the current user's check-in status
 * by querying the active queue from the backend.
 */
export function useCheckInStatus() {
  const user = useAuthStore((s) => s.user);
  const { data: queue = [], isLoading } = useQueueStatus();

  const isCheckedIn = useMemo(() => {
    if (!user) return false;
    return queue.some(
      (q) => String(q.consultantId).toLowerCase() === String(user.id).toLowerCase()
    );
  }, [queue, user]);

  return { isCheckedIn, isLoading };
}
