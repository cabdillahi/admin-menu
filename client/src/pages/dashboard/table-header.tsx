"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  title: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selectedCount?: number;
  totalCount?: number;
  onRefresh?: () => void;
  onExport?: () => void;
  onAdd?: () => void;
  addButtonText?: string;
  showColumnToggle?: boolean;
  columns?: Array<{
    id: string;
    label: string;
    visible: boolean;
    onToggle: (visible: boolean) => void;
  }>;
  filters?: Array<{
    id: string;
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export function TableHeaderUI({
  title,
  description,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  selectedCount = 0,
  totalCount = 0,
  onRefresh,
  onExport,
  onAdd,
  addButtonText = "Add New",
  showColumnToggle = true,
  columns = [],
  filters = [],
  actions,
  className,
}: TableHeaderProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            {totalCount > 0 && (
              <Badge variant="secondary" className="font-mono text-xs">
                {totalCount.toLocaleString()} total
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {selectedCount} selected
              </Badge>
              <span className="text-xs text-muted-foreground">
                of {totalCount} items
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-transparent"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              <span className="sr-only md:not-sr-only md:ml-2">Refresh</span>
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="bg-transparent"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Export</span>
            </Button>
          )}

          {actions}

          {onAdd && (
            <Button
              size="sm"
              onClick={onAdd}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">
                {addButtonText}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-2">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          )}

          {/* Filters */}
          {filters.map((filter) => (
            <DropdownMenu key={filter.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent">
                  <Filter className="h-4 w-4" />
                  <span className="ml-2">{filter.label}</span>
                  {filter.value && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filter.options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => filter.onChange(option.value)}
                    className={cn(
                      "cursor-pointer",
                      filter.value === option.value && "bg-accent"
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
                {filter.value && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => filter.onChange("")}
                      className="cursor-pointer text-muted-foreground"
                    >
                      Clear filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Column Toggle */}
        {showColumnToggle && columns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                <Settings2 className="h-4 w-4" />
                <span className="ml-2">Columns</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.visible}
                  onCheckedChange={column.onToggle}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
