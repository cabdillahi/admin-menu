import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Bed,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  School,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    link: "/dashboard/main",
  },
  {
    icon: School,
    label: "Category",
    hasDropdown: false,
    isExpanded: false,
    link: "/dashboard/category",
  },
  {
    icon: Bed,
    label: "Food",
    link: "/dashboard/food",
  },
  {
    icon: User,
    label: "Customer",
    hasDropdown: true,
    isExpanded: true,
    subItems: [
      { label: "Customers", link: "/dashboard/customer" },
      { label: "Users", link: "/dashboard/user" },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNavClick = (hasSubItems: boolean) => {
    // Only close on mobile (screen width < 768px) and if item has no subItems
    if (window.innerWidth < 768 && !hasSubItems) {
      setSidebarOpen(false);
    }
  };

  const handleSubItemClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderSidebarItem = (item: (typeof sidebarItems)[0]) => {
    const isActive = item.link && location.pathname.startsWith(item.link);

    const buttonContent = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start cursor-pointer relative",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          collapsed && "justify-center px-2"
        )}
        onClick={() => item.hasDropdown && toggleExpanded(item.label)}
      >
        <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.hasDropdown &&
              (expandedItems.includes(item.label) ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              ))}
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.link ?? "#"}
              onClick={() => handleNavClick(!!item.subItems)}
            >
              {buttonContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        to={item.link ?? "#"}
        onClick={() => handleNavClick(!!item.subItems)}
      >
        {buttonContent}
      </Link>
    );
  };

  return (
    <TooltipProvider>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] min-h-screen overflow-y-auto scrollHidde z-40 transform border-r text-[#f8fafc] transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-80",
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="w-full flex mt-3 justify-center items-center gap-2 px-2">
          {!collapsed ? (
            <>
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-full border"
              />
              <h1 className="text-lg font-semibold flex-1">Dashboard</h1>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-8 w-8"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8"
              onClick={() => setCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex h-[86vh] flex-col">
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              return (
                <div key={item.label}>
                  {renderSidebarItem(item)}

                  {item.subItems && !collapsed && (
                    <div
                      className={cn(
                        "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500",
                        expandedItems.includes(item.label)
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      {item.subItems.map((subItem) => {
                        const subActive =
                          subItem.link &&
                          location.pathname.startsWith(subItem.link);

                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.link ?? "#"}
                            onClick={handleSubItemClick}
                          >
                            <Button
                              variant={subActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start text-sm text-muted-foreground hover:text-foreground",
                                subActive &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              {subItem.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-2">
            {collapsed ? (
              <>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Support</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2 text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-3 h-4 w-4" />
                  Support
                </Button>

                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </Button>

                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </TooltipProvider>
  );
}
