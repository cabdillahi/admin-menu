import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ReportResponse } from "../types/types";
import { url } from "../url";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["report"],
  endpoints: (builder) => ({
    //  Daily Report
    getDailyReport: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/daily",
        method: "GET",
      }),
      providesTags: ["report"],
    }),

    //  Monthly Report
    getMonthlyReport: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/monthly",
        method: "GET",
      }),
      providesTags: ["report"],
    }),

    //  Yearly Report
    getYearlyReport: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/yearly",
        method: "GET",
      }),
      providesTags: ["report"],
    }),
  }),
});

export const {
  useGetDailyReportQuery,
  useGetMonthlyReportQuery,
  useGetYearlyReportQuery,
} = reportApi;
