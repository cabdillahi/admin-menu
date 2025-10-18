import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp, UserCheck } from "lucide-react"

const stats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { title: "Active Sessions", value: "1,234", change: "+8%", icon: Activity },
  { title: "Revenue", value: "$45,231", change: "+23%", icon: TrendingUp },
  { title: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: UserCheck },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
