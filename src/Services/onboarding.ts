import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import {
  onQueryStartedDefault,
  onMutationStartedDefault,
} from './serviceUtility'

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
      query: (data) => ({
        url: `/admin-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    adminLogout: builder.mutation({
      query: (postData) => ({
        url: `/admin-api/auth/logout`,
        method: 'POST',
        body: { ...postData },
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    editAdminProfile: builder.mutation({
      query: (data) => ({
        url: '/admin-api/admin-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStartedDefault,
    }),

    // Admin User api
    getAdmins: builder.query({
      query: (data) => ({
        url: `/admin-api/admin-actions/get-admin-users`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['Admin'],
      onQueryStarted: onQueryStartedDefault,
    }),
    createAdminUser: builder.mutation({
      query: (data) => ({
        url: '/admin-api/auth/create-admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStartedDefault,
    }),
    removeAdminUser: builder.mutation({
      query: (data) => ({
        url: '/admin-api/admin-actions/remove-admin',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateAdminUser: builder.mutation({
      query: (data) => ({
        url: '/admin-api/admin-actions/update-admin-details',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStartedDefault,
    }),

    // Platform Users api
    getPlatformUsers: builder.query({
      query: (data) => ({
        url: `/user-api/user-actions/get-all-users`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['PlatformUsers'],
    }),
    createSuperUser: builder.mutation({
      query: (data) => ({
        url: '/admin-api/admin-actions/create-super-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStartedDefault,
    }),

    // Partner List api
    getPartnerList: builder.query({
      query: () => `/user-api/partner/get-all-partners`,
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Admin'],
    }),
    removePlatformUsers: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/delete-user',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updatePlatformUsers: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/update-user',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getAuditLogs: builder.query({
      query: (data) => ({
        url: `/admin-api/admin-actions/get-audit-logs`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['SubscribedUsers'],
    }),
    blockSubscribedUsers: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/update-subscription',
        method: 'PUT',
        params: { ...data },
      }),
      invalidatesTags: ['PlatformUsers', 'Subscription'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getSubsriptionLogs: builder.query({
      query: (data) => ({
        url: '/admin-api/admin-actions/get-transactions-logs',
        method: 'GET',
        params: { ...data },
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getTransactionLogs: builder.query({
      query: (data) => ({
        url: '/admin-api/admin-actions/get-transactions-details',
        method: 'GET',
        params: { ...data },
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response) => response.data,
    }),
    // Youtube api's
    getYoutube: builder.query({
      query: (data) => ({
        url: `/admin-api/dashboard-actions/get-dashboard-item`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['Youtube'],
      onQueryStarted: onQueryStartedDefault,
    }),
    youtubeLive: builder.mutation({
      query: (data) => ({
        url: '/admin-api/dashboard-actions/create-dashboard-item',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Youtube'],
    }),
    updateStreaminStatus: builder.mutation({
      query: (data) => ({
        url: '/admin-api/dashboard-actions/update-dashboard-item',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Youtube'],
      onQueryStarted: onMutationStartedDefault,
    }),
    removeStreamingUrl: builder.mutation({
      query: (data) => ({
        url: '/admin-api/dashboard-actions/remove-dashboard-item',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Youtube'],
      onQueryStarted: onMutationStartedDefault,
    }),
    // Forget Password Api's
    adminForgetPassword: builder.mutation({
      query: (data) => ({
        url: '/admin-api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    createAdminPassword: builder.mutation({
      query: (data) => ({
        url: `/admin-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getAdminPrivileges: builder.query({
      query: (data) => ({
        url: `/admin-api/admin-actions/get-privileges`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadFile: builder.query({
      query: (data) => ({
        url: 'admin-api/admin-actions/download-file',
        method: 'GET',
        params: { ...data },
      }),
      transformResponse: (response) => response.response,
      onQueryStarted: onQueryStartedDefault,
    }),
    // Advertisement Api's
    getAds: builder.query({
      query: (data) => ({
        url: `/admin-api/ads/get-ads`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['Ads'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getCategoryAds: builder.query({
      query: () => ({
        url: `/admin-api/ads/get-category`,
        method: 'GET',
      }),
      providesTags: ['Ads'],
      onQueryStarted: onQueryStartedDefault,
    }),
    uploadAds: builder.mutation({
      query: (data) => ({
        url: `/admin-api/ads/upload-ad`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ads'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteAd: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/delete-ad',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ads'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateAdStatus: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/update-ad-status',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ads'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateGoogleAds: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/update-google-ads',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ads'],
      onQueryStarted: onMutationStartedDefault,
    }),
    viewFile: builder.query({
      query: (data) => ({
        url: 'admin-api/ads/view-file',
        method: 'GET',
        params: { ...data },
      }),
      transformResponse: (response) => response.response,
      onQueryStarted: onQueryStartedDefault,
    }),
    // Admin Analytic api's
    getActiveUsers: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-active-users-data`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getUsersCount: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-users-count`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['Subscription'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getSubscribedUsers: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-subscribed-users-data`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getRevenueData: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-revenue-data`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    // Info-graphic api's
    getInfographics: builder.query({
      query: (data) => ({
        url: `/admin-api/info-graphics/get-infographics`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['File'],
      onQueryStarted: onQueryStartedDefault,
    }),
    uploadInfographicFile: builder.mutation({
      query: (data) => ({
        url: `/admin-api/info-graphics/upload-infographic`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['File'],
      onQueryStarted: onMutationStartedDefault,
    }),
    viewInfographicFile: builder.query({
      query: (data) => ({
        url: 'admin-api/info-graphics/view-infographic',
        method: 'GET',
        params: { ...data },
      }),
      transformResponse: (response) => response.response,
      onQueryStarted: onQueryStartedDefault,
    }),
    updateInfographicStatus: builder.mutation({
      query: (data) => ({
        url: '/admin-api/info-graphics/update-infographic-status',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['File'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteInfographic: builder.mutation({
      query: (data) => ({
        url: '/admin-api/info-graphics/delete-infographic',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['File'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getFeedbackData: builder.query({
      query: (data) => ({
        url: `/admin-api/feedback/list`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getFeedbackFileData: builder.query({
      query: (data) => ({
        url: `/admin-api/feedback/details/${data}`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    // rss--feed
    getFeeds: builder.query({
      query: (data) => ({
        url: `/admin-api/dashboard-actions/get-dashboard-item`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['Feeds'],
      onQueryStarted: onQueryStartedDefault,
    }),
    deleteFeed: builder.mutation({
      query: (data) => ({
        url: '/admin-api/dashboard-actions/remove-dashboard-item',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Feeds'],
      onQueryStarted: onMutationStartedDefault,
    }),
    uploadFeed: builder.mutation({
      query: (data) => ({
        url: `/admin-api/dashboard-actions/create-dashboard-item`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Feeds'],
      onQueryStarted: onMutationStartedDefault,
    }),

    // Business Streaming
    getBusinessStreaming: builder.query({
      query: (data) => ({
        url: `/admin-api/business-streaming/get-stream`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['MarketBiz'],
      onQueryStarted: onQueryStartedDefault,
    }),
    uploadBusinessStreaming: builder.mutation({
      query: (data) => ({
        url: `/admin-api/business-streaming/add-stream`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MarketBiz'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateBusinessStreaming: builder.mutation({
      query: (data) => ({
        url: '/admin-api/business-streaming/update-stream',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MarketBiz'],
      onQueryStarted: onMutationStartedDefault,
    }),
    removeBusinessStreaming: builder.mutation({
      query: (data) => ({
        url: '/admin-api/business-streaming/remove-stream',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MarketBiz'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getTwitterUser: builder.query({
      query: (data) => ({
        url: `/admin-api/twitter/get-twitter-following`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['TwitterUser'],
      onQueryStarted: onQueryStartedDefault,
    }),
    setTwitterUser: builder.mutation({
      query: (data) => ({
        url: `/admin-api/twitter/follow-user`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TwitterUser'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteTwitterUser: builder.mutation({
      query: (data) => ({
        url: '/admin-api/twitter/unfollow-user',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['TwitterUser'],
      onQueryStarted: onMutationStartedDefault,
    }),
    twitterAuth: builder.mutation({
      query: (data) => ({
        url: `/admin-api/twitter/auth`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    // Coupon API's
    getCoupons: builder.query({
      query: (data) => ({
        url: `/admin-api/coupon/get-coupons`,
        params: { ...data },
        method: 'GET',
      }),
      providesTags: ['Coupon'],
      onQueryStarted: onQueryStartedDefault,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: '/admin-api/coupon/create-coupon ',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateCoupon: builder.mutation({
      query: (data) => ({
        url: '/admin-api/coupon/update-coupon',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteCoupon: builder.mutation({
      query: (data) => ({
        url: '/admin-api/coupon/delete-coupon',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getSubscriptionPlans: builder.query({
      query: () => ({
        url: `/admin-api/admin-actions/get-subscription-plans`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getTrialUser: builder.query({
      query: (data) => ({
        url: `/admin-api/admin-actions/get-free-trial-users`,
        params: { ...data },
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    accessSubscription: builder.mutation({
      query: (data) => ({
        url: `/admin-api/admin-actions/add-user-free-subscriptions`,
        method: 'Put',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['PlatformUsers'],
    }),
    // Google Trends
    createGoogleFeed: builder.mutation({
      query: (data) => ({
        url: '/admin-api/google-feed/create-google-feed',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getGoogleFeed: builder.query({
      query: (data) => ({
        url: `/admin-api/google-feed/get-google-feed`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['GoogleTrends'],
      onQueryStarted: onQueryStartedDefault,
    }),
    updateGoogleFeed: builder.mutation({
      query: (data) => ({
        url: `/admin-api/google-feed/update-google-feed`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteGoogleFeed: builder.mutation({
      query: (data) => ({
        url: `/admin-api/google-feed/delete-google-feed`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['GoogleTrends'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getCountriesList: builder.query({
      query: () => ({
        url: `/admin-api/google-feed/get-google-countries-list`,
        method: 'GET',
      }),
    }),
    // Newsletter Advertisement
    getNewsletterAds: builder.query({
      query: (data) => ({
        url: `/admin-api/ads/get-newsletter-ads`,
        method: 'GET',
        params: { ...data },
      }),
      providesTags: ['newsletterAds'],
      onQueryStarted: onQueryStartedDefault,
    }),
    uploadNewsletterAd: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/upload-newsletter-ad',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['newsletterAds'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteNewsletterAd: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/delete-newsletter-ad',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['newsletterAds'],
      onQueryStarted: onMutationStartedDefault,
    }),
    updateNewsletterAdStatus: builder.mutation({
      query: (data) => ({
        url: '/admin-api/ads/update-newsletterAd-status',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['newsletterAds'],
      onQueryStarted: onMutationStartedDefault,
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
  useGetAuditLogsQuery,
  useBlockSubscribedUsersMutation,
  useGetSubsriptionLogsQuery,
  useGetTransactionLogsQuery,
  useGetYoutubeQuery,
  useYoutubeLiveMutation,
  useRemoveStreamingUrlMutation,
  useUpdateStreaminStatusMutation,
  useAdminForgetPasswordMutation,
  useCreateAdminPasswordMutation,
  useGetAdminPrivilegesQuery,
  useLazyDownloadFileQuery,
  useGetAdsQuery,
  useUploadAdsMutation,
  useDeleteAdMutation,
  useUpdateAdStatusMutation,
  useUpdateGoogleAdsMutation,
  useLazyViewFileQuery,
  useGetActiveUsersQuery,
  useGetUsersCountQuery,
  useGetSubscribedUsersQuery,
  useGetRevenueDataQuery,
  useGetInfographicsQuery,
  useUploadInfographicFileMutation,
  useLazyViewInfographicFileQuery,
  useUpdateInfographicStatusMutation,
  useDeleteInfographicMutation,
  useGetFeedbackDataQuery,
  useGetFeedbackFileDataQuery,
  useDeleteFeedMutation,
  useGetFeedsQuery,
  useUploadFeedMutation,
  useGetBusinessStreamingQuery,
  useRemoveBusinessStreamingMutation,
  useUploadBusinessStreamingMutation,
  useUpdateBusinessStreamingMutation,
  useGetTwitterUserQuery,
  useSetTwitterUserMutation,
  useDeleteTwitterUserMutation,
  useTwitterAuthMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetSubscriptionPlansQuery,
  useGetTrialUserQuery,
  useAccessSubscriptionMutation,
  useGetCategoryAdsQuery,
  useCreateGoogleFeedMutation,
  useGetGoogleFeedQuery,
  useUpdateGoogleFeedMutation,
  useDeleteGoogleFeedMutation,
  useGetCountriesListQuery,
  useGetNewsletterAdsQuery,
  useUploadNewsletterAdMutation,
  useDeleteNewsletterAdMutation,
  useUpdateNewsletterAdStatusMutation,
} = onboardingApi
