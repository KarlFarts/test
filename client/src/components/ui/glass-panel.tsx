import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "modal" | "sidebar" | "card" | "overlay";
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
  children?: ReactNode;
}

const glassVariants = {
  default: "bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10",
  modal: "bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass",
  sidebar: "bg-white/80 dark:bg-black/80 backdrop-blur-lg border-r border-white/20 dark:border-white/10",
  card: "bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-elevation-2",
  overlay: "bg-black/20 backdrop-blur-sm"
};

const blurVariants = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md", 
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl"
};

const opacityVariants = {
  low: "bg-opacity-10 dark:bg-opacity-10",
  medium: "bg-opacity-20 dark:bg-opacity-20", 
  high: "bg-opacity-30 dark:bg-opacity-30"
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", blur, opacity, children, ...props }, ref) => {
    const baseClasses = glassVariants[variant];
    const blurClasses = blur ? blurVariants[blur] : "";
    const opacityClasses = opacity ? opacityVariants[opacity] : "";
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          blurClasses,
          opacityClasses,
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

export function GlassModal({ 
  children, 
  className, 
  ...props 
}: Omit<GlassPanelProps, "variant">) {
  return (
    <GlassPanel
      variant="modal"
      className={cn("rounded-xl p-6", className)}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}

export function GlassCard({ 
  children, 
  className, 
  ...props 
}: Omit<GlassPanelProps, "variant">) {
  return (
    <GlassPanel
      variant="card"
      className={cn("rounded-lg p-4", className)}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { type: "spring", damping: 20, stiffness: 300 }
      }}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}
