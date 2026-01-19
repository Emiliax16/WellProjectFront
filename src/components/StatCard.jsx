import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react"

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  onClick,
  actionLabel = "Ver todos",
  variant = "default",
  className
}) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend > 0) return <TrendingUp className="h-3.5 w-3.5" />
    if (trend < 0) return <TrendingDown className="h-3.5 w-3.5" />
    return <Minus className="h-3.5 w-3.5" />
  }

  const getTrendColor = () => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card
      className={cn(
        "border-0 group cursor-pointer hover:shadow-premium-lg transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header: Icon + Title */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            {icon && (
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {icon}
              </div>
            )}
          </div>

          {/* Main Value */}
          <div>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
          </div>

          {/* Trend Indicator */}
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1.5 text-sm font-medium", getTrendColor())}>
              {getTrendIcon()}
              <span>
                {trend > 0 ? '+' : ''}{trend} {trendLabel || 'este mes'}
              </span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 border-t border-border/50">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors w-full">
              <span>{actionLabel}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
