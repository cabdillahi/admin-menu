"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAccountsQuery } from "@/services/accounts/account-api";
import { useGetbookingsQuery } from "@/services/booking/booking-api";
import { useGetPaymentsQuery } from "@/services/payment/payment.api";
import type { Payment } from "@/services/types/types";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  DollarSign,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";
import { CreatePaymentDialog } from "./create-payment-dialog";
import { DeletePaymentDialog } from "./delete-payment-dialog";
import { PaymentSkeleton } from "./payment-skeleton";
import { printPaymentReceipt } from "./print-receipt";
import { UpdatePaymentDialog } from "./upate-payment";

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case "CASH":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "MOBILEMONEY":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
    case "CREDIT_CARD":
    case "DEBIT_CARD":
      return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
    case "ONLINE":
      return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  }
};

const columns: ColumnDef<Payment>[] = [
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
          Payment ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {/* @ts-ignore */}
        {row.getValue("id").slice(0, 8)}...
      </div>
    ),
  },
  {
    accessorKey: "bookingId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Booking ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {/* @ts-ignore */}
        {row.getValue("bookingId").slice(0, 8)}...
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-semibold text-foreground">{formatted}</div>;
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return (
        <Badge variant="outline" className={getMethodColor(method)}>
          {method.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="cursor-pointer"
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              View payment details
            </DropdownMenuItem>
            <UpdatePaymentDialog payment={payment}>
              {/* <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Edit className="h-4 w-4" />
                Edit payment
              </DropdownMenuItem> */}
            </UpdatePaymentDialog>
            <DeletePaymentDialog payment={payment}>
              <DropdownMenuItem
                className="text-destructive cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                Delete payment
              </DropdownMenuItem>
            </DeletePaymentDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PaymentTable() {
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

  const [paymentIdSearch, setPaymentIdSearch] = React.useState("");
  const [bookingIdSearch, setBookingIdSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("");

  const {
    data: paymentsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetPaymentsQuery({
    page: 1,
    limit: 1000,
    search: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const { data: bookingsData } = useGetbookingsQuery({ page: 1, limit: 1000 });
  const { data: accountsData } = useGetAccountsQuery({ page: 1, limit: 1000 });

  const handlePrintReceiptFromTable = (payment: Payment) => {
    const selectedBooking = bookingsData?.data.find(
      (booking) => booking.id === payment.bookingId
    );
    const selectedAccount = accountsData?.data.find(
      (account) => account.id === payment.id
    );

    printPaymentReceipt({
      payment,
      bookingInfo: selectedBooking
        ? {
            customerName: selectedBooking.customer.name,
            roomNumber: selectedBooking.room.number,
          }
        : undefined,
      accountInfo: selectedAccount
        ? {
            accountName: selectedAccount.name,
            accountType: selectedAccount.type,
          }
        : undefined,
    });
  };

  console.log(handlePrintReceiptFromTable);

  const filteredData = React.useMemo(() => {
    let filtered = paymentsResponse?.data || [];

    if (paymentIdSearch) {
      filtered = filtered.filter((payment) =>
        payment.id.toLowerCase().includes(paymentIdSearch.toLowerCase())
      );
    }

    if (bookingIdSearch) {
      filtered = filtered.filter((payment) =>
        payment.bookingId.toLowerCase().includes(bookingIdSearch.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (payment) => payment.status.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    if (methodFilter) {
      filtered = filtered.filter(
        (payment) => payment.method.toUpperCase() === methodFilter.toUpperCase()
      );
    }

    return filtered;
  }, [
    paymentsResponse?.data,
    paymentIdSearch,
    bookingIdSearch,
    statusFilter,
    methodFilter,
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

  const clearFilters = () => {
    setPaymentIdSearch("");
    setBookingIdSearch("");
    setStatusFilter("");
    setMethodFilter("");
  };

  const hasActiveFilters =
    paymentIdSearch || bookingIdSearch || statusFilter || methodFilter;

  if (isLoading) {
    return <PaymentSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error loading payments
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              There was a problem loading the payments data.
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
            Payment Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage payment transactions, methods, and statuses.
          </p>
        </div>
        <CreatePaymentDialog>
          <Button
            size="sm"
            className="bg-primary dark:bg-secondary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Add Payment</span>
          </Button>
        </CreatePaymentDialog>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Payment ID
            </label>
            <Input
              placeholder="Search by payment ID..."
              value={paymentIdSearch}
              onChange={(e) => setPaymentIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Booking ID
            </label>
            <Input
              placeholder="Search by booking ID..."
              value={bookingIdSearch}
              onChange={(e) => setBookingIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Method
            </label>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="MOBILEMONEY">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
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
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No payments found.
                    </p>
                    <CreatePaymentDialog>
                      <Button variant="outline" size="sm">
                        Add your first payment
                      </Button>
                    </CreatePaymentDialog>
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
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
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
