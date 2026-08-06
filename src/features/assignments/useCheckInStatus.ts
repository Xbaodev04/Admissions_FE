import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useQueueMe, useQueueStatus } from "./assignment.hooks";

/**
 * Custom hook to determine the current user's check-in status
 * by querying personal queue status (queue/me) and active queue from backend.
 */
export function useCheckInStatus() {
  const user = useAuthStore((s) => s.user);
  const { data: myQueue, isLoading: isMeLoading } = useQueueMe();
  const { data: queue = [], isLoading: isQueueLoading } = useQueueStatus();

  const isCheckedIn = useMemo(() => {
    if (!user) return false;

    // 1. Primary check: myQueue status from GET /api/Assignment/queue/me
    if (myQueue && typeof myQueue.isActive === "boolean") {
      return myQueue.isActive;
    }

    // 2. Secondary check: check if user exists & is active in general queue list
    const userIdStr = String(user.id).toLowerCase();
    return queue.some(
      (q) => String(q.consultantId).toLowerCase() === userIdStr && (q.isActive ?? true)
    );
  }, [myQueue, queue, user]);

  return { isCheckedIn, isLoading: isMeLoading || isQueueLoading };
}
