
import { ActivityFeed } from "./activity-feed"
import { QuickActions } from "./quick-actions"
import { StatsCards } from "./stats-cards"

export function Overview() {
  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your project.</p>
        </div>

        {/* Stats Grid */}
        <StatsCards />

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </main>
  )
}
