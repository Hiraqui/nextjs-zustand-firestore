import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconClassName?: string;
}

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
