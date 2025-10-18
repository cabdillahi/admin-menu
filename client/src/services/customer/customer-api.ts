import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type { Tenant, TenantInput, TenantUpdate } from "../types/tenant-type";

export const customerApi = createApi({
  reducerPath: "tenantApi",
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
  tagTypes: ["Tenant"],
  endpoints: (builder) => ({
    createcustomer: builder.mutation<Tenant, TenantInput>({
      query: (body) => ({
        url: "/tenant",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tenant"],
    }),

    updatecustomer: builder.mutation<Tenant, TenantUpdate>({
      query: (body) => ({
        url: `/tenant/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tenant"],
    }),

    deletecustomer: builder.mutation<Tenant, { id: string }>({
      query: ({ id }) => ({
        url: `/tenant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tenant"],
    }),

    getCustomers: builder.query<Tenant[], void>({
      query: () => "/tenant",
      providesTags: ["Tenant"],
    }),

    getTenant: builder.query<Tenant, string>({
      query: (id) => `/tenant/${id}`,
      providesTags: ["Tenant"],
    }),
  }),
});

export const {
  useCreatecustomerMutation,
  useGetCustomersQuery,
  useUpdatecustomerMutation,
  useDeletecustomerMutation,
} = customerApi;
