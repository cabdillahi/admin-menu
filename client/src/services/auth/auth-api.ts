// RTK Query Auth API
import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type { LoginRequest, LoginResponse, UserResponse } from "../types/types";
import type { UserInput, UserResponseData } from "../types/user-type";

// --- Helper to store and remove tokens ---
const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// --- Base Query with Reauth logic ---
const baseQuery = fetchBaseQuery({
  baseUrl: url,
  credentials: "include", // still supports cookie auth
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// --- Wrapped Base Query to handle refresh flow ---
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token is expired (401 unauthorized)
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearTokens();
      api.dispatch(authApi.util.resetApiState());
      return result;
    }

    // Try refreshing token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken, refreshToken: newRefreshToken } =
        refreshResult.data as { accessToken: string; refreshToken: string };

      // Save new tokens
      saveTokens(accessToken, newRefreshToken);

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token invalid → logout
      clearTokens();
      api.dispatch(authApi.util.resetApiState());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accessToken && data?.refreshToken) {
            saveTokens(data.accessToken, data.refreshToken);
          }
        } catch {
          // ignore
        }
      },
    }),
    createUser: builder.mutation<void, UserInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          clearTokens();
        }
      },
    }),

    whoami: builder.query<UserResponse, void>({
      query: () => "/auth/me",
    }),
    getUsers: builder.query<UserResponseData, void>({
      query: () => "/auth/",
    }),
  }),
});

export const {
  useSignInMutation,
  useWhoamiQuery,
  useSignOutMutation,
  useGetUsersQuery,
  useCreateUserMutation
} = authApi;
