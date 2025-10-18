import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Account } from "@/services/types/types";

interface AccountsTableProps {
  accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleAccount = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const getAccountTypeBadgeVariant = (type: Account["type"]) => {
    switch (type) {
      case "ASSET":
        return "default";
      case "LIABILITY":
        return "secondary";
      case "EQUITY":
        return "outline";
      case "REVENUE":
        return "default";
      case "EXPENSE":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">
            No accounts found matching your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-foreground">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="text-foreground">Account Name</TableHead>
                <TableHead className="text-foreground">Type</TableHead>
                <TableHead className="text-right text-foreground">
                  Balance
                </TableHead>
                <TableHead className="text-right text-foreground">
                  Transactions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                const isExpanded = expandedAccounts.has(account.id);
                return (
                  <Collapsible key={account.id} open={isExpanded} asChild>
                    <>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleAccount(account.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {account.name}
                        </TableCell>
                        <TableCell>
                          <Badge className="dark:bg-secondary"
                            variant={getAccountTypeBadgeVariant(account.type)}
                          >
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {account.transactions.length}
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/50 p-0">
                            <div className="p-4">
                              <h4 className="mb-3 font-semibold text-foreground">
                                Transactions
                              </h4>
                              {account.transactions.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-foreground">
                                        Date
                                      </TableHead>
                                      <TableHead className="text-foreground">
                                        Description
                                      </TableHead>
                                      <TableHead className="text-foreground ">
                                        Type
                                      </TableHead>
                                      <TableHead className="text-right text-foreground">
                                        Amount
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {account.transactions.map((transaction) => (
                                      <TableRow key={transaction.id}>
                                        <TableCell className="text-muted-foreground">
                                          {formatDate(transaction.date)}
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                          {transaction.description || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          <Badge className="dark:bg-secondary"
                                            variant={
                                              transaction.type === "CREDIT"
                                                ? "default"
                                                : "secondary"
                                            }
                                          >
                                            {transaction.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell
                                          className={`text-right font-medium ${
                                            transaction.type === "CREDIT"
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {transaction.type === "CREDIT"
                                            ? "+"
                                            : "-"}
                                          {formatCurrency(transaction.amount)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No transactions for this account.
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {accounts.map((account) => {
          const isExpanded = expandedAccounts.has(account.id);
          return (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base text-foreground">
                      {account.name}
                    </CardTitle>
                    <Badge variant={getAccountTypeBadgeVariant(account.type)}>
                      {account.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.transactions.length} transactions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Collapsible open={isExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => toggleAccount(account.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" />
                          Hide Transactions
                        </>
                      ) : (
                        <>
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Show Transactions
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {account.transactions.length > 0 ? (
                      account.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                {transaction.description || "N/A"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(transaction.date)}
                              </p>
                              <Badge
                                variant={
                                  transaction.type === "CREDIT"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </div>
                            <p
                              className={`text-lg font-bold ${
                                transaction.type === "CREDIT"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {transaction.type === "CREDIT" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No transactions for this account.
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
