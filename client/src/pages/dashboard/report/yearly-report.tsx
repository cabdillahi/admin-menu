"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetYearlyReportQuery } from "@/services/reports/report-api";
import { ReportHeader } from "@/components/dashboard/reports/report-header";
import { ReportSummary } from "@/components/dashboard/reports/report-summary";
import { AccountsTable } from "@/components/dashboard/reports/accounts-table";

export default function YearlyReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");

  const { data, isLoading, isError } = useGetYearlyReportQuery();

  const filteredAccounts = useMemo(() => {
    if (!data?.accounts) return [];

    return data.accounts.filter((account) => {
      // Account type filter
      if (accountTypeFilter !== "all" && account.type !== accountTypeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesAccountName = account.name.toLowerCase().includes(query);
        const matchesTransaction = account.transactions.some(
          (t) =>
            t.description?.toLowerCase().includes(query) ||
            t.amount.toString().includes(query)
        );
        if (!matchesAccountName && !matchesTransaction) {
          return false;
        }
      }

      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        const hasMatchingTransaction = account.transactions.some(
          (transaction) => {
            const transactionDate = new Date(transaction.date);
            if (dateRange.from && transactionDate < dateRange.from)
              return false;
            if (dateRange.to) {
              const endOfDay = new Date(dateRange.to);
              endOfDay.setHours(23, 59, 59, 999);
              if (transactionDate > endOfDay) return false;
            }
            return true;
          }
        );
        if (!hasMatchingTransaction) return false;
      }

      return true;
    });
  }, [data?.accounts, searchQuery, dateRange, accountTypeFilter]);

  const handlePrint = () => {
    window.print();
  };

  if (isError) {
    return (
      <div className="container mx-auto space-y-6 p-4 md:p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load yearly report. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6 lg:p-8">
      <ReportHeader
        title="Yearly Report"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        accountTypeFilter={accountTypeFilter}
        onAccountTypeFilterChange={setAccountTypeFilter}
        onPrint={handlePrint}
      />

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block">
        <h1 className="mb-4 text-3xl font-bold">Yearly Report</h1>
        {dateRange?.from && (
          <p className="mb-6 text-muted-foreground">
            Period: {dateRange.from.toLocaleDateString()} -{" "}
            {dateRange.to?.toLocaleDateString() || "Present"}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <ReportSummary summary={data.summary} />
          <AccountsTable accounts={filteredAccounts} />
        </div>
      ) : (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
