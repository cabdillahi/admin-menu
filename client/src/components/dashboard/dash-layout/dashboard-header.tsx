"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserDropDown } from "./user-dropdown";
import { useWhoamiQuery } from "@/services/auth/auth-api";

interface MobileNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: MobileNavProps) {
  const { data } = useWhoamiQuery();

  return (
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
          <img src="/logo.jpg" className="w-10 rounded-full h-10" alt="" />
          <span className="font-semibold">
            {data?.user.tenant.name.toUpperCase()}
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="hidden sm:flex">
            <Globe className="mr-1 h-3 w-3" />
            Eng
          </Badge>
          <ThemeToggle />
        </div>
        <UserDropDown />
      </div>
    </header>
  );
}
