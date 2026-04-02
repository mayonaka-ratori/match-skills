import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/types";

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  label: string;
  className?: string;
}

const statusStyles: Record<AvailabilityStatus, string> = {
  available_today: "bg-emerald-100 text-emerald-700 border-emerald-200",
  available_this_week: "bg-blue-100 text-blue-700 border-blue-200",
  available_weekend: "bg-violet-100 text-violet-700 border-violet-200",
  contact_required: "bg-muted text-muted-foreground border-border",
};

const statusDot: Record<AvailabilityStatus, string> = {
  available_today: "bg-emerald-500",
  available_this_week: "bg-blue-500",
  available_weekend: "bg-violet-500",
  contact_required: "bg-muted-foreground",
};

export function AvailabilityBadge({
  status,
  label,
  className,
}: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", statusDot[status])}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
