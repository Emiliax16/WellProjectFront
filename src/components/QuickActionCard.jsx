import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

export function QuickActionCard({ title, description, icon, onClick, className }) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow cursor-pointer", className)} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
