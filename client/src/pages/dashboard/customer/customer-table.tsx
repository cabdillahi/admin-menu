import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useGetCustomersQuery } from "@/services/customer/customer-api";
import type { Tenant } from "@/services/types/types";
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
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import * as React from "react";
import { TableHeaderUI } from "../table-header";
import { CreateCustomerDialog } from "./create-customer-dialog";
import { CustomerSkeleton } from "./customer-skeleton";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { UpdateCustomerDialog } from "./upate-Customer";

const columns: ColumnDef<Tenant>[] = [
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
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string | null;
      const name = row.getValue("name") as string;
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={logo || undefined} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "subdomain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Subdomain
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("subdomain")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined;
      return (
        <div className="text-sm">
          {email || <span className="text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | undefined;
      return (
        <div className="text-sm">
          {phone || <span className="text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-sm">{row.getValue("city")}</div>,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Currency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("currency")}</div>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string | null;
      return website ? (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string | undefined;
      return (
        <div className="text-sm max-w-[200px] truncate">
          {address || <span className="text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm">{isActive ? "Active" : "Inactive"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original as any;

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
              onClick={() => navigator.clipboard.writeText(customer.id)}
              className="cursor-pointer"
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              View customer details
            </DropdownMenuItem>
            <UpdateCustomerDialog customer={customer}>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Edit className="h-4 w-4" />
                Edit customer
              </DropdownMenuItem>
            </UpdateCustomerDialog>
            <DeleteCustomerDialog customer={customer}>
              <DropdownMenuItem
                className="text-destructive cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                Delete customer
              </DropdownMenuItem>
            </DeleteCustomerDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function CustomersTable() {
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

  const [customerIdSearch, setCustomerIdSearch] = React.useState("");
  const [nameSearch, setNameSearch] = React.useState("");
  const [emailSearch, setEmailSearch] = React.useState("");
  const [phoneSearch, setPhoneSearch] = React.useState("");
  const [citySearch, setCitySearch] = React.useState("");
  const [currencySearch, setCurrencySearch] = React.useState("");

  const {
    data: customersResponse,
    isLoading,
    isError,
    refetch,
  } = useGetCustomersQuery();

  const filteredData = React.useMemo(() => {
    let filtered = customersResponse || [];

    // Filter by name
    if (nameSearch) {
      filtered = filtered.filter((customer) =>
        customer.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // Filter by email
    if (emailSearch) {
      filtered = filtered.filter((customer) =>
        customer.email?.toLowerCase().includes(emailSearch.toLowerCase())
      );
    }

    // Filter by phone
    if (phoneSearch) {
      filtered = filtered.filter((customer) =>
        customer.phone?.toLowerCase().includes(phoneSearch.toLowerCase())
      );
    }

    // Filter by city
    if (citySearch) {
      filtered = filtered.filter((customer) =>
        customer.city?.toLowerCase().includes(citySearch.toLowerCase())
      );
    }

    // Filter by currency
    if (currencySearch) {
      filtered = filtered.filter((customer) =>
        customer.currency?.toLowerCase().includes(currencySearch.toLowerCase())
      );
    }

    return filtered;
  }, [
    customersResponse,
    customerIdSearch,
    nameSearch,
    emailSearch,
    phoneSearch,
    citySearch,
    currencySearch,
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

  const handleExport = () => {
    console.log("Exporting customers data...");
  };

  const clearFilters = () => {
    setCustomerIdSearch("");
    setNameSearch("");
    setEmailSearch("");
    setPhoneSearch("");
    setCitySearch("");
    setCurrencySearch("");
  };

  const hasActiveFilters =
    customerIdSearch ||
    nameSearch ||
    emailSearch ||
    phoneSearch ||
    citySearch ||
    currencySearch;

  const columnToggleData = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .map((column) => ({
      id: column.id,
      label: column.id
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      visible: column.getIsVisible(),
      onToggle: (visible: boolean) => column.toggleVisibility(visible),
    }));

  if (isLoading) {
    return <CustomerSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error loading customers
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              There was a problem loading the customers data.
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
      <TableHeaderUI
        title="Customer Management"
        description="Manage customer information, bookings, and contact details."
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search customers..."
        selectedCount={table.getFilteredSelectedRowModel().rows.length}
        totalCount={filteredData.length}
        onRefresh={handleRefresh}
        onExport={handleExport}
        actions={
          <CreateCustomerDialog>
            <Button
              size="sm"
              className="bg-primary dark:bg-secondary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">
                Add Customer
              </span>
            </Button>
          </CreateCustomerDialog>
        }
        addButtonText="Add Customer"
        columns={columnToggleData}
      />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Customer ID
            </label>
            <Input
              placeholder="Search by ID..."
              value={customerIdSearch}
              onChange={(e) => setCustomerIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <Input
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Phone
            </label>
            <Input
              placeholder="Search by phone..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              City
            </label>
            <Input
              placeholder="Search by city..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Currency
            </label>
            <Input
              placeholder="Search by currency..."
              value={currencySearch}
              onChange={(e) => setCurrencySearch(e.target.value)}
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
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No customers found.
                    </p>
                    <CreateCustomerDialog>
                      <Button variant="outline" size="sm">
                        Add your first customer
                      </Button>
                    </CreateCustomerDialog>
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
