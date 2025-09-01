import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

type MetricCardProps = {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: string | number
    positive?: boolean
  }
  loading?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg p-2 bg-muted/50">
          <div className="h-5 w-5 text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div
                className={cn(
                  "mt-1 text-xs font-medium",
                  trend.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
