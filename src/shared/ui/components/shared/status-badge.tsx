import { Badge, type BadgeProps } from "@/shared/ui/components/ui/badge";
import { STATUS_CONFIG } from "@/shared/types/common";

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: string;
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <Badge variant="default" {...props}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  );
}
