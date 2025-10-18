import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Database, BarChart3, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Database className="mr-2 h-4 w-4" />
          View Database
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </CardContent>
    </Card>
  )
}
