import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type {
  Balance,
  BalanceInput,
  BalanceResponse,
  BalanceUpdate,
} from "../types/types";

// ✅ Customer Balance API
export const balanceApi = createApi({
  reducerPath: "balanceApi",
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
  tagTypes: ["balance"],
  endpoints: (builder) => ({
    // CREATE
    createBalance: builder.mutation<Balance, BalanceInput>({
      query: (body) => ({
        url: "/balance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["balance"],
    }),

    // UPDATE
    updateBalance: builder.mutation<Balance, BalanceUpdate>({
      query: (body) => ({
        url: "/balance",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["balance"],
    }),

    // DELETE
    deleteBalance: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/balance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["balance"],
    }),

    // GET ALL (Paginated)
    getBalances: builder.query<
      BalanceResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);

        return {
          url: `/balance?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["balance"],
    }),

    // GET ONE BY ID
    getBalanceById: builder.query<Balance, string>({
      query: (id) => ({
        url: `/balance/${id}`,
        method: "GET",
      }),
      providesTags: ["balance"],
    }),
  }),
});

export const {
  useCreateBalanceMutation,
  useUpdateBalanceMutation,
  useDeleteBalanceMutation,
  useGetBalancesQuery,
  useGetBalanceByIdQuery,
} = balanceApi;
