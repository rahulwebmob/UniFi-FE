import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { onQueryStartedDefault, onMutationStarted } from './serviceUtility'

export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }
      return headers
    },
  }),
  tagTypes: [
    'Admin',
    'PlatformUsers',
    'TwitterUser',
    'Coupon',
    'GoogleTrends',
    'newsletterAds',
  ],
  endpoints: (builder) => ({
    // Admin api's
    adminLogin: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    adminLogout: builder.mutation({
      query: (postData) => ({
        url: `/admin-api/auth/logout`,
        method: 'POST',
        body: postData,
      }),
      onQueryStarted: onMutationStarted,
    }),
    editAdminProfile: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/admin-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),

    // Admin User api
    getAdmins: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/admin-actions/get-admin-users`,
        method: 'GET',
        params: data,
      }),
      providesTags: ['Admin'],
      onQueryStarted: onQueryStartedDefault,
    }),
    createAdminUser: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/auth/create-admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    removeAdminUser: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/admin-actions/remove-admin',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    updateAdminUser: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/admin-actions/update-admin-details',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),

    // Platform Users api
    getPlatformUsers: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/user-api/user-actions/get-all-users`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['PlatformUsers'],
    }),
    createSuperUser: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/admin-actions/create-super-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),

    // Partner List api
    getPartnerList: builder.query({
      query: () => `/user-api/partner/get-all-partners`,
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Admin'],
    }),
    removePlatformUsers: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/user-api/user-actions/delete-user',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),
    updatePlatformUsers: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/user-api/user-actions/update-user',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),
    getTransactionLogs: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/admin-actions/get-transactions-details',
        method: 'GET',
        params: data,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response) => response.data,
    }),
    // Youtube api's

    // Forget Password Api's
    adminForgetPassword: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    createAdminPassword: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    getAdminPrivileges: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/admin-actions/get-privileges`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadFile: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: 'admin-api/admin-actions/download-file',
        method: 'GET',
        params: data,
      }),
      transformResponse: (response) => response.response,
      onQueryStarted: onQueryStartedDefault,
    }),
    // Advertisement Api's
    getAds: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/ads/get-ads`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getCategoryAds: builder.query({
      query: () => ({
        url: `/admin-api/ads/get-category`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    viewFile: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: 'admin-api/ads/view-file',
        method: 'GET',
        params: data,
      }),
      transformResponse: (response) => response.response,
      onQueryStarted: onQueryStartedDefault,
    }),
    // Admin Analytic api's
    getActiveUsers: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/analytics/get-active-users-data`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    getSubscriptionPlans: builder.query({
      query: () => ({
        url: `/admin-api/admin-actions/get-subscription-plans`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getTrialUser: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/admin-actions/get-free-trial-users`,
        params: data,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    accessSubscription: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/admin-actions/add-user-free-subscriptions`,
        method: 'Put',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['PlatformUsers'],
    }),
    // Google Trends
    createGoogleFeed: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: '/admin-api/google-feed/create-google-feed',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStarted,
    }),
    getGoogleFeed: builder.query({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/google-feed/get-google-feed`,
        method: 'GET',
        params: data,
      }),

      onQueryStarted: onQueryStartedDefault,
    }),
    updateGoogleFeed: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/google-feed/update-google-feed`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStarted,
    }),
    deleteGoogleFeed: builder.mutation({
      query: (data: Record<string, unknown>) => ({
        url: `/admin-api/google-feed/delete-google-feed`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStarted,
    }),
    getCountriesList: builder.query({
      query: () => ({
        url: `/admin-api/google-feed/get-google-countries-list`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetAdminsQuery,
  useCreateAdminUserMutation,
  useRemoveAdminUserMutation,
  useUpdateAdminUserMutation,
  useGetPlatformUsersQuery,
  useCreateSuperUserMutation,
  useGetPartnerListQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useEditAdminProfileMutation,
  useRemovePlatformUsersMutation,
  useUpdatePlatformUsersMutation,

  useGetTransactionLogsQuery,
  useAdminForgetPasswordMutation,
  useCreateAdminPasswordMutation,
  useGetAdminPrivilegesQuery,
  useLazyDownloadFileQuery,
  useGetAdsQuery,

  useLazyViewFileQuery,
  useGetActiveUsersQuery,

  useGetSubscriptionPlansQuery,
  useGetTrialUserQuery,
  useAccessSubscriptionMutation,
  useGetCategoryAdsQuery,
  useCreateGoogleFeedMutation,
  useGetGoogleFeedQuery,
  useUpdateGoogleFeedMutation,
  useDeleteGoogleFeedMutation,
  useGetCountriesListQuery,
} = onboardingApi
