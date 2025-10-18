"use client";

import type React from "react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetbookingsQuery } from "@/services/booking/booking-api";

interface DemographicData {
  label: string;
  value: number;
  color: string;
  darkColor: string;
}

export function CustomerDemographicsChart() {
  const {
    data: bookingsData,
    isLoading,
    isError,
  } = useGetbookingsQuery({ page: 1, limit: 1000 });

  const demographics = useMemo<DemographicData[]>(() => {
    if (!bookingsData?.data) {
      return [
        {
          label: "Single",
          value: 0,
          color: "oklch(0.82 0.10 140)",
          darkColor: "oklch(0.7 0.15 140)",
        },
        {
          label: "Double",
          value: 0,
          color: "oklch(0.65 0.18 200)",
          darkColor: "oklch(0.6 0.2 200)",
        },
        {
          label: "Suite",
          value: 0,
          color: "oklch(0.78 0.12 85)",
          darkColor: "oklch(0.68 0.15 85)",
        },
      ];
    }

    const categories = {
      single: 0,
      double: 0,
      suite: 0,
    };

    // Count bookings by room type
    bookingsData.data.forEach((booking) => {
      const roomType = booking.room?.type?.toUpperCase() || "";

      if (roomType.includes("SINGLE")) {
        categories.single++;
      } else if (roomType.includes("DOUBLE")) {
        categories.double++;
      } else if (roomType.includes("SUITE")) {
        categories.suite++;
      }
    });

    return [
      {
        label: "Single",
        value: categories.single,
        color: "oklch(0.82 0.10 140)",
        darkColor: "oklch(0.7 0.15 140)",
      },
      {
        label: "Double",
        value: categories.double,
        color: "oklch(0.65 0.18 200)",
        darkColor: "oklch(0.6 0.2 200)",
      },
      {
        label: "Suite",
        value: categories.suite,
        color: "oklch(0.78 0.12 85)",
        darkColor: "oklch(0.68 0.15 85)",
      },
    ];
  }, [bookingsData]);

  const total = demographics.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <Skeleton className="h-48 w-48 rounded-full" />
            <div className="flex-1 space-y-3 w-full">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Room Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            Failed to load room type data
          </div>
        </CardContent>
      </Card>
    );
  }

  let currentAngle = -90;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[oklch(0.65_0.18_200)] dark:bg-[oklch(0.6_0.2_200)]" />
            <CardTitle className="text-base font-semibold">
              Room Type Distribution
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-48 w-48"
          >
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              {demographics.map((item, index) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const innerRadius = 60;
                const outerRadius = 90;

                const x1 = 100 + innerRadius * Math.cos(startRad);
                const y1 = 100 + innerRadius * Math.sin(startRad);
                const x2 = 100 + outerRadius * Math.cos(startRad);
                const y2 = 100 + outerRadius * Math.sin(startRad);
                const x3 = 100 + outerRadius * Math.cos(endRad);
                const y3 = 100 + outerRadius * Math.sin(endRad);
                const x4 = 100 + innerRadius * Math.cos(endRad);
                const y4 = 100 + innerRadius * Math.sin(endRad);

                const largeArc = angle > 180 ? 1 : 0;

                const pathData = [
                  `M ${x1} ${y1}`,
                  `L ${x2} ${y2}`,
                  `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
                  `L ${x4} ${y4}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
                ].join(" ");

                return (
                  <motion.path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="transition-opacity hover:opacity-80 dark:fill-[var(--dark-color)]"
                    style={
                      { "--dark-color": item.darkColor } as React.CSSProperties
                    }
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground">
                Total Bookings
              </div>
              <div className="text-2xl font-bold">+{total}</div>
            </div>
          </motion.div>

          <div className="flex-1 space-y-3">
            {demographics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-medium">+{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
