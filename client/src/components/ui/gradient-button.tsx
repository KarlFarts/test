import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

const gradientVariants = {
  primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
  secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl",
  success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
  warning: "bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl",
  danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, loading = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
            gradientVariants[variant],
            sizeVariants[size],
            className
          )}
        >
          {children}
        </Slot>
      );
    }
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
          gradientVariants[variant],
          sizeVariants[size],
          className
        )}
        whileHover={{ 
          scale: 1.02,
          transition: { type: "spring", damping: 20, stiffness: 400 }
        }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:animate-shimmer" />
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {children}
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export function PrimaryButton(props: Omit<GradientButtonProps, "variant">) {
  return <GradientButton variant="primary" {...props} />;
}

export function SuccessButton(props: Omit<GradientButtonProps, "variant">) {
  return <GradientButton variant="success" {...props} />;
}

export function DangerButton(props: Omit<GradientButtonProps, "variant">) {
  return <GradientButton variant="danger" {...props} />;
}
