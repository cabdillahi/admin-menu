"use client";

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
import { useMemo } from "react";
import { useGetbookingsQuery } from "@/services/booking/booking-api";
import { useGetFoodsQuery } from "@/services/food/food-api";

export function OccupancyChart() {
  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetbookingsQuery({ page: 1, limit: 1000 });
  const { data: roomsData, isLoading: roomsLoading } = useGetFoodsQuery({
    page: 1,
    limit: 1000,
  });

  const monthlyData = useMemo(() => {
    if (!bookingsData?.data || !roomsData?.data) return [];

    const totalRooms = roomsData.meta.total;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Get last 9 months of data
    const monthsToShow = 9;
    const currentMonth = new Date().getMonth();
    const startMonth = currentMonth - monthsToShow + 1;

    const monthlyOccupancy = [];

    for (let i = 0; i < monthsToShow; i++) {
      const monthIndex = (startMonth + i + 12) % 12;
      const year = startMonth + i < 0 ? currentYear - 1 : currentYear;

      // Count unique rooms booked in this month
      const bookedRoomsInMonth = new Set(
        bookingsData.data
          .filter((booking) => {
            const checkInDate = new Date(booking.checkIn);
            return (
              checkInDate.getMonth() === monthIndex &&
              checkInDate.getFullYear() === year
            );
          })
          .map((booking) => booking.roomId)
      );

      const occupancyRate =
        totalRooms > 0
          ? Math.round((bookedRoomsInMonth.size / totalRooms) * 100)
          : 0;

      monthlyOccupancy.push({
        month: months[monthIndex],
        occupancy: occupancyRate,
      });
    }

    return monthlyOccupancy;
  }, [bookingsData, roomsData]);

  const maxValue = Math.max(...monthlyData.map((d) => d.occupancy), 1);
  const peakOccupancy = Math.max(...monthlyData.map((d) => d.occupancy), 0);

  if (bookingsLoading || roomsLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[oklch(0.75_0.15_340)] dark:bg-[oklch(0.65_0.2_340)]" />
            <CardTitle className="text-base font-semibold">
              Occupancy Rate
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
        <div className="relative h-64">
          {peakOccupancy > 0 && (
            <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-[oklch(0.75_0.15_340)] px-3 py-1 text-xs font-medium text-white dark:bg-[oklch(0.65_0.2_340)]">
              Peak: {peakOccupancy}%
            </div>
          )}

          <div className="flex h-full items-end justify-between gap-2 pt-12">
            {monthlyData.map((data, index) => {
              const height =
                maxValue > 0 ? (data.occupancy / maxValue) * 100 : 0;
              return (
                <motion.div
                  key={`${data.month}-${index}`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[oklch(0.75_0.15_340)] to-[oklch(0.75_0.15_340)]/40 transition-all hover:opacity-80 dark:from-[oklch(0.65_0.2_340)] dark:to-[oklch(0.65_0.2_340)]/40"
                      style={{ height: `${height * 1.5}px` }}
                    />
                    <div
                      className="absolute inset-0 w-full rounded-t-lg bg-gradient-to-t from-[oklch(0.75_0.15_340)]/20 to-transparent dark:from-[oklch(0.65_0.2_340)]/20"
                      style={{ height: `${height * 1.5}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {data.month}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="oklch(0.75 0.15 340)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.2"
              className="dark:stroke-[oklch(0.65_0.2_340)]"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
