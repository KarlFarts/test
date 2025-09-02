import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface TrafficLightIndicatorProps {
  state: "valid" | "warning" | "error";
  className?: string;
  showIcon?: boolean;
}

export function TrafficLightIndicator({ state, className, showIcon = true }: TrafficLightIndicatorProps) {
  const getStateConfig = (state: string) => {
    switch (state) {
      case "valid":
        return {
          color: "bg-green-500",
          icon: CheckCircle,
          label: "Valid"
        };
      case "warning":
        return {
          color: "bg-yellow-500",
          icon: AlertTriangle,
          label: "Warning"
        };
      case "error":
        return {
          color: "bg-red-500",
          icon: XCircle,
          label: "Error"
        };
      default:
        return {
          color: "bg-gray-500",
          icon: CheckCircle,
          label: "Unknown"
        };
    }
  };

  const config = getStateConfig(state);
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      {showIcon && <Icon className="w-3 h-3 text-muted-foreground" />}
    </div>
  );
}
