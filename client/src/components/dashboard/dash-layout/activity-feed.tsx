import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const activities = [
  {
    action: "User registration",
    time: "2 minutes ago",
    status: "success",
  },
  {
    action: "Database backup",
    time: "1 hour ago",
    status: "success",
  },
  {
    action: "API deployment",
    time: "3 hours ago",
    status: "success",
  },
  {
    action: "Security scan",
    time: "6 hours ago",
    status: "warning",
  },
]

export function ActivityFeed() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest project activities and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div
                className={cn("h-2 w-2 rounded-full", activity.status === "success" ? "bg-green-500" : "bg-yellow-500")}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
