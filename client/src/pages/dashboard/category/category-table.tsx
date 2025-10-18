"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Edit, Trash2, X, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CategorySkeleton } from "./category-skeleton"
import { TableHeaderUI } from "../table-header"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { CreateCategoryDialog } from "./create-category-dialog"
import { useGetCategoriesQuery } from "@/services/category/category-api"
import type { Category } from "@/services/types/categorytype"
import { UpdateCategoryDialog } from "./upate-category"

const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | null
      const name = row.getValue("name") as string
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageUrl || undefined} alt={name} />
          <AvatarFallback>
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )
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
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">{description || "No description"}</div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original

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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">View category details</DropdownMenuItem>
            <UpdateCategoryDialog category={category}>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onSelect={(e) => e.preventDefault()}>
                <Edit className="h-4 w-4" />
                Edit category
              </DropdownMenuItem>
            </UpdateCategoryDialog>
            <DeleteCategoryDialog category={category}>
              <DropdownMenuItem
                className="text-destructive cursor-pointer flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                Delete category
              </DropdownMenuItem>
            </DeleteCategoryDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function CategoriesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [categoryIdSearch, setCategoryIdSearch] = React.useState("")
  const [categoryNameSearch, setCategoryNameSearch] = React.useState("")
  const [descriptionSearch, setDescriptionSearch] = React.useState("")

  const {
    data: categoriesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: categoryNameSearch,
    sortBy: "id",
    order: "asc",
  })

  const filteredData = React.useMemo(() => {
    let filtered = categoriesResponse?.data || []

    // Filter by category ID
    if (categoryIdSearch) {
      filtered = filtered.filter((category) => category.id.toString().includes(categoryIdSearch))
    }

    // Filter by description
    if (descriptionSearch) {
      filtered = filtered.filter((category) =>
        category.description?.toLowerCase().includes(descriptionSearch.toLowerCase()),
      )
    }

    return filtered
  }, [categoriesResponse?.data, categoryIdSearch, descriptionSearch])

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
  })

  const handleRefresh = async () => {
    await refetch()
  }

  const handleExport = () => {
    console.log("Exporting data...")
  }

  const clearFilters = () => {
    setCategoryIdSearch("")
    setCategoryNameSearch("")
    setDescriptionSearch("")
  }

  const hasActiveFilters = categoryIdSearch || categoryNameSearch || descriptionSearch

  const columnToggleData = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .map((column) => ({
      id: column.id,
      label: column.id.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      visible: column.getIsVisible(),
      onToggle: (visible: boolean) => column.toggleVisibility(visible),
    }))

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <CategorySkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error loading categories. Please try again.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <TableHeaderUI
        title="Category Management"
        description="Manage and organize product categories for your business."
        searchValue={categoryNameSearch}
        onSearchChange={setCategoryNameSearch}
        searchPlaceholder="Search categories..."
        selectedCount={table.getFilteredSelectedRowModel().rows.length}
        totalCount={categoriesResponse?.meta.total || 0}
        onRefresh={handleRefresh}
        onExport={handleExport}
        actions={
          <CreateCategoryDialog>
            <Button size="sm" className="bg-primary dark:bg-secondary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Add Category</span>
            </Button>
          </CreateCategoryDialog>
        }
        addButtonText="Add Category"
        columns={columnToggleData}
      />

      <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category ID</label>
            <Input
              placeholder="Search by ID..."
              value={categoryIdSearch}
              onChange={(e) => setCategoryIdSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category Name</label>
            <Input
              placeholder="Search by name..."
              value={categoryNameSearch}
              onChange={(e) => setCategoryNameSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Input
              placeholder="Search by description..."
              value={descriptionSearch}
              onChange={(e) => setDescriptionSearch(e.target.value)}
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {filteredData.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
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
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
