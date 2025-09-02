import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function FloatingActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  className,
  variant = "primary" 
}: FloatingActionButtonProps) {
  return (
    <motion.div
      className={cn(
        "fixed z-50 group",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200",
          variant === "primary" 
            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0" 
            : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
        )}
      >
        <Icon className="w-6 h-6" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-black/80 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
