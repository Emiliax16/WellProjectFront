import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

export function StatCard({ title, value, icon, variant = "default", className }) {
  const variantStyles = {
    default: "border-l-primary",
    success: "border-l-green-500",
    warning: "border-l-yellow-500",
    danger: "border-l-red-500",
  }

  return (
    <Card className={cn("border-l-4", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
