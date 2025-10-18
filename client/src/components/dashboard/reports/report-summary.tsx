import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportSummary } from "@/services/types/types"
import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank, BarChart3 } from "lucide-react"

interface ReportSummaryProps {
  summary: ReportSummary
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const summaryItems = [
    {
      title: "Total Assets",
      value: summary.totalAssets,
      icon: Wallet,
      color: "text-chart-1",
    },
    {
      title: "Total Liabilities",
      value: summary.totalLiabilities,
      icon: TrendingDown,
      color: "text-chart-2",
    },
    {
      title: "Total Equity",
      value: summary.totalEquity,
      icon: PiggyBank,
      color: "text-chart-3",
    },
    {
      title: "Total Revenue",
      value: summary.totalRevenue,
      icon: TrendingUp,
      color: "text-chart-4",
    },
    {
      title: "Total Expenses",
      value: summary.totalExpenses,
      icon: BarChart3,
      color: "text-chart-5",
    },
    {
      title: "Net Income",
      value: summary.netIncome,
      icon: DollarSign,
      color: summary.netIncome >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {summaryItems.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(item.value)}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
