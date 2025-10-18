"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Database,
  Menu,
  X,
  Activity,
  TrendingUp,
  UserCheck,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-provider";
const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
  { icon: Database, label: "Database" },
  { icon: FileText, label: "Logs" },
  { icon: Shield, label: "Security" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { title: "Active Sessions", value: "1,234", change: "+8%", icon: Activity },
  { title: "Revenue", value: "$45,231", change: "+23%", icon: TrendingUp },
  { title: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: UserCheck },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center space-x-2 md:ml-0 ml-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-semibold">Dashboard</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:flex">
              <Globe className="mr-1 h-3 w-3" />
              Production
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col pt-14 md:pt-0">
            <nav className="flex-1 space-y-1 p-4">
              {sidebarItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.active &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your project.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from
                      last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest project activities and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
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
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            activity.status === "success"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    View Database
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
