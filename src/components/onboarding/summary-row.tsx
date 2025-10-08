import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconClassName?: string;
}

/**
 * A row component for displaying onboarding summary information.
 *
 * This component renders a styled card containing an icon, label, and value.
 * It's used in the onboarding summary to display collected user information
 * in a consistent, visually appealing format. The component supports
 * custom icon styling and handles text truncation for long values.
 *
 * @param props - Component props
 * @param props.icon - Lucide icon component to display
 * @param props.label - Label text for the data field
 * @param props.value - Value to display
 * @param props.iconClassName - Optional CSS classes for icon customization
 * @returns JSX element representing a summary row
 */
export default function OnboardingSummaryRow({
  icon: Icon,
  label,
  value,
  iconClassName,
}: SummaryRowProps) {
  return (
    <div className="card-bottom-shadow flex items-center space-x-3 rounded-lg bg-secondary px-4 py-3 text-gray-700">
      <Icon className={cn("h-8 w-8 shrink-0", iconClassName)} />
      <div className="min-w-0 flex-1 flex items-center">
        <span className="font-medium shrink-0">{label}:</span>
        <span className="ml-2 font-bold truncate">{value}</span>
      </div>
    </div>
  );
}
