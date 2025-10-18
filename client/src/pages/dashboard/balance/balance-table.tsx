"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBalancesQuery } from "@/services/balance/balance-api";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import * as React from "react";
import { BalanceSkeleton } from "./balance-skeleton";
import type { Balance } from "@/services/types/types";
import { UpdateBalanceDialog } from "./update-balance-dialog";
import { DeleteBalanceDialog } from "./delete-balance-dialog";
import { CreateBalanceDialog } from "./create-balance-dialog";

const columns: ColumnDef<Balance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Balance ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Customer ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const balance = row.original;
      return (
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium">
            {balance.customerId}
          </div>
          {balance.customer?.name && (
            <div className="text-xs text-muted-foreground">
              {balance.customer.name}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      const isNegative = amount < 0;
      return (
        <div
          className={`font-bold ${
            isNegative
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const balance = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(balance.id)}
              className="cursor-pointer"
            >
              Copy balance ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              View balance details
            </DropdownMenuItem>
            <UpdateBalanceDialog balance={balance}>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Edit className="h-4 w-4" />
                Edit balance
              </DropdownMenuItem>
            </UpdateBalanceDialog>
            <DeleteBalanceDialog balance={balance}>
              <DropdownMenuItem
                className="text-destructive cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                Delete balance
              </DropdownMenuItem>
            </DeleteBalanceDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BalanceTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [balanceIdSearch, setBalanceIdSearch] = React.useState("");
  const [customerIdSearch, setCustomerIdSearch] = React.useState("");
  const [customerNameSearch, setCustomerNameSearch] = React.useState("");

  const {
    data: balancesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetBalancesQuery({
    page: 1,
    limit: 1000,
    search: "",
  });

  const filteredData = React.useMemo(() => {
    let filtered = balancesResponse?.data || [];

    if (balanceIdSearch) {
      filtered = filtered.filter((balance) =>
        balance.id.toLowerCase().includes(balanceIdSearch.toLowerCase())
      );
    }

    if (customerIdSearch) {
      filtered = filtered.filter((balance) =>
        balance.customerId
          .toLowerCase()
          .includes(customerIdSearch.toLowerCase())
      );
    }

    if (customerNameSearch) {
      filtered = filtered.filter((balance) =>
        balance.customer?.name
          ?.toLowerCase()
          .includes(customerNameSearch.toLowerCase())
      );
    }

    return filtered;
  }, [
    balancesResponse?.data,
    balanceIdSearch,
    customerIdSearch,
    customerNameSearch,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleRefresh = async () => {
    await refetch();
  };

  //   const handleExport = () => {
  //     console.log("Exporting balances data...")
  //   }

  const clearFilters = () => {
    setBalanceIdSearch("");
    setCustomerIdSearch("");
    setCustomerNameSearch("");
  };

  const hasActiveFilters =
    balanceIdSearch || customerIdSearch || customerNameSearch;

  if (isLoading) {
    return <BalanceSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error loading balances
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              There was a problem loading the balances data.
            </p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Balance Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage customer balances, debits, and credits.
          </p>
        </div>
        <CreateBalanceDialog>
          <Button
            size="sm"
            className="bg-primary dark:bg-secondary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Add Balance</span>
          </Button>
        </CreateBalanceDialog>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Balance ID
            </label>
            <Input
              placeholder="Search by balance ID..."
              value={balanceIdSearch}
              onChange={(e) => setBalanceIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Customer ID
            </label>
            <Input
              placeholder="Search by customer ID..."
              value={customerIdSearch}
              onChange={(e) => setCustomerIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Customer Name
            </label>
            <Input
              placeholder="Search by customer name..."
              value={customerNameSearch}
              onChange={(e) => setCustomerNameSearch(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No balances found.
                    </p>
                    <CreateBalanceDialog>
                      <Button variant="outline" size="sm">
                        Add your first balance
                      </Button>
                    </CreateBalanceDialog>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {filteredData.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
