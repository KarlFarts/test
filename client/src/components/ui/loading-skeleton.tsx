import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "table" | "text" | "avatar" | "button";
  lines?: number;
  animate?: boolean;
}

const skeletonVariants = {
  default: "h-4 bg-muted rounded",
  card: "h-32 bg-muted rounded-lg",
  table: "h-12 bg-muted rounded",
  text: "h-4 bg-muted rounded w-3/4",
  avatar: "h-10 w-10 bg-muted rounded-full",
  button: "h-10 bg-muted rounded-md w-24"
};

export function LoadingSkeleton({ 
  className, 
  variant = "default", 
  lines = 1, 
  animate = true 
}: LoadingSkeletonProps) {
  const baseClasses = skeletonVariants[variant];
  
  if (lines === 1) {
    return (
      <motion.div
        className={cn(baseClasses, className)}
        animate={animate ? {
          opacity: [0.5, 1, 0.5],
        } : undefined}
        transition={animate ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(baseClasses, className)}
          animate={animate ? {
            opacity: [0.5, 1, 0.5],
          } : undefined}
          transition={animate ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          } : undefined}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className="flex space-x-4 p-4 border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-20" />
        </motion.div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="p-6 border rounded-lg space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <LoadingSkeleton variant="avatar" />
            <div className="space-y-2">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="h-3 w-16" />
            </div>
          </div>
          <LoadingSkeleton lines={3} />
          <div className="flex space-x-2">
            <LoadingSkeleton variant="button" />
            <LoadingSkeleton variant="button" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
