import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type {
  PaidBalanceInput,
  PaidBalanceListResponse,
  PaidBalanceResponse,
  PaidBalanceUpdate,
} from "../types/types";

// ✅ RTK Query API slice
export const paidBalanceApi = createApi({
  reducerPath: "paidBalanceApi",
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
  tagTypes: ["paidBalance"],
  endpoints: (builder) => ({
    // 🔹 Create Paid Balance
    createPaidBalance: builder.mutation<PaidBalanceResponse, PaidBalanceInput>({
      query: (body) => ({
        url: "/paid-balance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["paidBalance"],
    }),

    // 🔹 Get All Paid Balances (Paginated + Search)
    getPaidBalances: builder.query<
      PaidBalanceListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);

        return {
          url: `/paid-balance?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["paidBalance"],
    }),

    // 🔹 Get One Paid Balance by ID
    getPaidBalanceById: builder.query<PaidBalanceResponse, string>({
      query: (id) => ({
        url: `/paid-balance/${id}`,
        method: "GET",
      }),
      providesTags: ["paidBalance"],
    }),

    // 🔹 Update Paid Balance
    updatePaidBalance: builder.mutation<PaidBalanceResponse, PaidBalanceUpdate>(
      {
        query: (body) => ({
          url: "/paid-balance",
          method: "PATCH",
          body,
        }),
        invalidatesTags: ["paidBalance"],
      }
    ),

    // 🔹 Delete Paid Balance
    deletePaidBalance: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/paid-balance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paidBalance"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useCreatePaidBalanceMutation,
  useGetPaidBalancesQuery,
  useGetPaidBalanceByIdQuery,
  useUpdatePaidBalanceMutation,
  useDeletePaidBalanceMutation,
} = paidBalanceApi;
