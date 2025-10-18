"use client";

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useWhoamiQuery } from "@/services/auth/auth-api";
import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../sidebar";
import { DashboardHeader } from "./dashboard-header";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isLoading, data } = useWhoamiQuery();
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, data?.user]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner variant="circle" />
        </div>
      ) : (
        <div className="flex flex-1 h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 overflow-y-auto p-4">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
