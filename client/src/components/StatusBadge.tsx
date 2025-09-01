import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, AlertCircle, HelpCircle, XCircle } from "lucide-react"
import { ReactNode } from "react"

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

type StatusBadgeProps = {
  status: string
  className?: string
  showIcon?: boolean
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
  icon: IconProp,
  size = 'md',
}: StatusBadgeProps) {
  // Map status to variant and default icon
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase()
    
    if (['active', 'completed', 'success', 'published', 'approved'].includes(lowerStatus)) {
      return {
        variant: 'success' as const,
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      }
    }
    
    if (['pending', 'in-progress', 'in progress', 'draft', 'review'].includes(lowerStatus)) {
      return {
        variant: 'warning' as const,
        icon: <Clock className="h-3.5 w-3.5" />,
      }
    }
    
    if (['inactive', 'rejected', 'failed', 'error', 'overdue'].includes(lowerStatus)) {
      return {
        variant: 'danger' as const,
        icon: <XCircle className="h-3.5 w-3.5" />,
      }
    }
    
    if (['needs attention', 'warning', 'attention'].includes(lowerStatus)) {
      return {
        variant: 'warning' as const,
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      }
    }
    
    return {
      variant: 'default' as const,
      icon: <HelpCircle className="h-3.5 w-3.5" />,
    }
  }

  const { variant, icon } = getStatusConfig(status)
  const Icon = IconProp || icon
  
  const variantClasses = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-muted text-foreground border-border',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium leading-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {showIcon && Icon && (
        <span className="mr-1.5 flex items-center">
          {Icon}
        </span>
      )}
      <span className="capitalize">{status.toLowerCase()}</span>
    </div>
  )
}
