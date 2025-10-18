"use client";

import { useState } from "react";
import type { Account } from "@/services/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import AccountSkeleton from "./account-skeleton";
import { useGetAccountsQuery } from "@/services/accounts/account-api";
import CreateAccountDialog from "./create-account-dialog";
import UpdateAccountDialog from "./update-account-dialog";
import DeleteAccountDialog from "./delete-account-dialog";

const accountTypeColors = {
  ASSET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  LIABILITY:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  EQUITY:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  REVENUE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  EXPENSE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function AccountTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  console.log(setLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetAccountsQuery({
    page,
    limit,
    search,
    sortBy,
    order,
  });

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  if (isLoading) return <AccountSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Failed to load accounts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <CreateAccountDialog />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={`${sortBy}-${order}`}
          onValueChange={(value) => {
            const [newSortBy, newOrder] = value.split("-");
            setSortBy(newSortBy);
            setOrder(newOrder as "asc" | "desc");
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="type-asc">Type (A-Z)</SelectItem>
            <SelectItem value="type-desc">Type (Z-A)</SelectItem>
            <SelectItem value="balance-asc">Balance (Low-High)</SelectItem>
            <SelectItem value="balance-desc">Balance (High-Low)</SelectItem>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Code</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No accounts found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className={accountTypeColors[account.type]}
                    >
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {account.code || "-"}
                  </TableCell>
                  <TableCell>${account.balance.toFixed(2)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(account)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(account)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data?.data.length || 0} of {data?.meta.total || 0} accounts
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {data?.meta.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.meta.totalPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedAccount && (
        <>
          <UpdateAccountDialog
            account={selectedAccount}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
          />
          <DeleteAccountDialog
            account={selectedAccount}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </div>
  );
}
