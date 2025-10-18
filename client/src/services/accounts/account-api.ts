import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Account,
  AccountInput,
  AccountUpdate,
  AccountResponse,
} from "../types/types";
import { url } from "../url";

export const accountApi = createApi({
  reducerPath: "accountApi",
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
  tagTypes: ["account"],
  endpoints: (builder) => ({
    // ✅ Create Account
    createAccount: builder.mutation<Account, AccountInput>({
      query: (body) => ({
        url: "/account",
        method: "POST",
        body,
      }),
      invalidatesTags: ["account"],
    }),

    // ✅ Update Account
    updateAccount: builder.mutation<Account, AccountUpdate>({
      query: (body) => ({
        url: "/account",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["account"],
    }),

    // ✅ Delete Account
    deleteAccount: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["account"],
    }),

    // ✅ Get One Account
    getAccountById: builder.query<Account, string>({
      query: (id) => `/account/${id}`,
      providesTags: ["account"],
    }),

    // ✅ Get All Accounts (List)
    getAccounts: builder.query<
      AccountResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        order?: "asc" | "desc";
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `/account?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["account"],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountsQuery,
  useGetAccountByIdQuery,
} = accountApi;
