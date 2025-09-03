import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { readLangCookie } from '../utils/globalUtils'

import { onMutationStarted, onQueryStarted } from './serviceUtility'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }

      const languePref = readLangCookie()
      if (languePref) {
        headers.set('language', languePref)
      }

      return headers
    },
  }),
  tagTypes: [
    'Webinars',
    'Me',
    'Subscription',
    'UserProfile',
    'Tutor',
    'ApprovedTutors',
    'Chapters',
    'Lessons',
    'Courses',
    'Admin',
    'PlatformUsers',
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    oAuthLogin: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/oauth-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    logout: builder.mutation({
      query: (postData) => ({
        url: `/user-api/auth/logout`,
        method: 'POST',
        body: postData,
      }),
      onQueryStarted: onMutationStarted,
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: '/user-api/auth/signup',
        method: 'post',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    loggedUser: builder.query({
      query: () => '/user-api/auth/me',
      keepUnusedDataFor: 0,
      providesTags: ['Me'],
      onQueryStarted,
    }),
    buyPremiumSubscription: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/buy-premium-subscription`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/change-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    createPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    emailVerification: builder.query({
      query: (body) => ({
        url: `/user-api/auth/email-verification`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted,
    }),
    resendEmail: builder.mutation({
      query: (data) => ({
        url: `user-api/auth/resend-verification-email`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),

    myProfile: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStarted,
    }),
    generateReferralLink: builder.mutation({
      query: () => ({
        url: '/user-api/user-actions/generate-referral-link',
        method: 'PUT',
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStarted,
    }),
    getReferralLink: builder.query({
      query: () => ({
        url: '/user-api/user-actions/get-referral-link',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
      onQueryStarted,
    }),

    // admin-panel educator section
    getEducationTutorApplication: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-educators-applications`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['Tutor'],
    }),
    getApprovedTutor: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-approved-educators`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['ApprovedTutors'],
    }),
    approveEducatorStatus: builder.mutation({
      query: (params) => ({
        url: `/education-api/admin-panel/approve-educator-status`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Tutor'],
    }),
    inviteEducator: builder.mutation({
      query: (params) => ({
        url: `/education-api/admin-panel/invite-educators`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStarted,
    }),
    registerEducator: builder.mutation({
      query: (params) => ({
        url: `/education-api/onboarding/register-educator`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStarted,
    }),

    educatorForgetPassword: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    educatorResetPassword: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    educatorLogout: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-logout`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    educatorLogin: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    reconsiderStatus: builder.mutation({
      query: (data) => ({
        url: `/education-api/admin-panel/reconsider-declined-educators`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Tutor'],
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/add-course`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    getLessonsDetails: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-lessons-of-chapter`,
        method: 'GET',
        params,
      }),
      providesTags: (_, __, arg) => [
        {
          type: 'Lessons',
          id: `${arg?.courseId}${arg?.chapterId}`,
        },
      ],
      onQueryStarted,
    }),
    viewTutorDetail: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-particular-educator-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    downloadCV: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-cv-of-educator`,
        method: 'GET',
        params,
      }),
    }),
    watchVideo: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-intro-video-of-educator`,
        method: 'GET',
        params,
      }),
    }),
    addCourseMetaData: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-meta-data-of-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    addCourseChapter: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Chapters'],
    }),
    listChapers: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      keepUnusedDataFor: 0,
      providesTags: ['Chapters'],
    }),
    addLesson: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-lesson`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    getAwsUrlForUpload: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    successForVideoUpload: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/success-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    updateChapter: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/update-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Chapters'],
    }),
    updateLesson: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/update-lesson`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        {
          type: 'Lessons',
          id: `${arg.courseId}${arg.chapterId}`,
        },
      ],
    }),
    downloadResource: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-of-resource`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    coursePreview: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-preview-of-course`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      keepUnusedDataFor: 0,
    }),
    sortChapters: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/sort-chapters`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    sortLesson: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/sort-lessons`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
    }),
    updateCourse: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/update-my-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Courses'],
    }),
    getAllWebinar: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-all-webinars`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
      onQueryStarted,
    }),
    getAllCourses: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-my-courses`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted,
      keepUnusedDataFor: 0,
    }),
    getCoursesCount: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-courses-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted,
      keepUnusedDataFor: 0,
    }),
    getWebinarsCount: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-webinars-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Webinars'],
      onQueryStarted,
      keepUnusedDataFor: 0,
    }),
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-my-payments`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted,
      transformResponse: (response) => ({
        data: response.data || [],
      }),
    }),
    generateInvoice: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    verifyEducatorEmail: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/email-exist`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    createWebinar: builder.mutation({
      query: (data) => ({
        url: `education-api/onboarding/add-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    updateWebinar: builder.mutation({
      query: (data) => ({
        url: `education-api/onboarding/update-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['Webinars'],
    }),
    getWebinarDetail: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
    }),
    getWebinarAttachments: builder.query({
      query: (data) => ({
        url: `education-api/onboarding/get-webinar-resources`,
        method: 'GET',
        params: data,
      }),
      keepUnusedDataFor: 0,
    }),
    getPastWebinars: builder.query({
      query: (data) => ({
        url: `education-api/onboarding/get-past-webinar-details`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted,
      keepUnusedDataFor: 0,
    }),
    getDisplayScheduleTime: builder.mutation({
      query: (body) => ({
        url: `education-api/onboarding/get-timing-of-webinar`,
        method: 'POST',
        body,
      }),
    }),
    getCategoryList: builder.query({
      query: () => ({
        url: `education-api/onboarding/get-educator-categories-list`,
        method: 'GET',
      }),
    }),

    educatorAuth: builder.query({
      query: () => ({
        url: `education-api/onboarding/get-my-details`,
        method: 'GET',
      }),
      onQueryStarted,
    }),

    getWebinarDetails: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/view-educator-profile`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    getAllCoursesDetails: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/get-courses-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    getEducationAdminInvoice: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/get-all-transactions`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    downloadAdminInvoice: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/get-transactions-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    deleteEducator: builder.mutation({
      query: (body) => ({
        url: `education-api/admin-panel/delete-declined-educator`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tutor'],
      onQueryStarted: onMutationStarted,
    }),

    getAdmins: builder.query({
      query: (params) => ({
        url: `/admin-api/admin-actions/get-admin-users`,
        method: 'GET',
        params: { ...params },
      }),
      providesTags: ['Admin'],
      onQueryStarted,
    }),
    createAdminUser: builder.mutation({
      query: (body) => ({
        url: '/admin-api/auth/create-admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    updateAdminUser: builder.mutation({
      query: (body) => ({
        url: '/admin-api/admin-actions/update-admin-details',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    removeAdminUser: builder.mutation({
      query: (body) => ({
        url: '/admin-api/admin-actions/remove-admin',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    getAdminPrivileges: builder.query({
      query: (params) => ({
        url: `/admin-api/admin-actions/get-privileges`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),

    // Platform User APIs
    getPlatformUsers: builder.query({
      query: (params) => ({
        url: `/user-api/user-actions/get-all-users`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['PlatformUsers'],
    }),
    createSuperUser: builder.mutation({
      query: (body) => ({
        url: '/admin-api/admin-actions/create-super-user',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),
    updatePlatformUser: builder.mutation({
      query: (body) => ({
        url: '/user-api/user-actions/update-user',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),
    deletePlatformUser: builder.mutation({
      query: (body) => ({
        url: '/user-api/user-actions/delete-user',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PlatformUsers'],
      onQueryStarted: onMutationStarted,
    }),
    getSubscriptionPlans: builder.query({
      query: () => ({
        url: `/admin-api/admin-actions/get-subscription-plans`,
        method: 'GET',
      }),
      onQueryStarted,
    }),
    accessSubscription: builder.mutation({
      query: (body) => ({
        url: `/admin-api/admin-actions/add-user-free-subscriptions`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: onMutationStarted,
      invalidatesTags: ['PlatformUsers'],
    }),

    // Analytics Dashboard APIs
    getUsersCount: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-users-count`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted,
    }),
    getActiveUsers: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-active-users-data`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted,
    }),
    getRevenueData: builder.query({
      query: (data) => ({
        url: `/admin-api/analytics/get-revenue-data`,
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted,
    }),
  }),
})

export const {
  useLoginMutation,
  useOAuthLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useLoggedUserQuery,
  useBuyPremiumSubscriptionMutation,
  useEducatorForgetPasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useCreatePasswordMutation,
  useEmailVerificationQuery,
  useResendEmailMutation,
  useMyProfileMutation,
  useGenerateReferralLinkMutation,
  useGetReferralLinkQuery,
  // education:Tutor Application
  useGetEducationTutorApplicationQuery,
  // education:Approved Tutor
  useGetApprovedTutorQuery,
  useApproveEducatorStatusMutation,
  useInviteEducatorMutation,
  useRegisterEducatorMutation,
  useEducatorResetPasswordMutation,
  useEducatorLoginMutation,
  useEducatorLogoutMutation,
  useReconsiderStatusMutation,
  useCreateCourseMutation,
  useGetLessonsDetailsQuery,
  useViewTutorDetailQuery,
  useDownloadCVQuery,
  useWatchVideoQuery,
  useCreateWebinarMutation,
  useAddCourseMetaDataMutation,
  useAddCourseChapterMutation,
  useListChapersQuery,
  useAddLessonMutation,
  useGetAwsUrlForUploadMutation,
  useSuccessForVideoUploadMutation,
  useUpdateChapterMutation,
  useUpdateLessonMutation,
  useDownloadResourceMutation,
  useCoursePreviewQuery,
  useSortChaptersMutation,
  useSortLessonMutation,
  useUpdateCourseMutation,
  useGetAllWebinarQuery,
  useGetAllCoursesQuery,
  useGetCoursesCountQuery,
  useGetWebinarsCountQuery,
  useGetPaymentHistoryQuery,
  useLazyGenerateInvoiceQuery,
  useLazyVerifyEducatorEmailQuery,
  useGetAllCoursesDetailsQuery,
  useGetWebinarDetailsQuery,
  useUpdateWebinarMutation,
  useGetWebinarDetailQuery,
  useGetWebinarAttachmentsQuery,
  useGetPastWebinarsQuery,
  useGetDisplayScheduleTimeMutation,
  useGetCategoryListQuery,
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
  useDeleteEducatorMutation,
  useEducatorAuthQuery,
  // Admin APIs
  useGetAdminsQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useRemoveAdminUserMutation,
  useGetAdminPrivilegesQuery,
  // Platform User APIs
  useGetPlatformUsersQuery,
  useCreateSuperUserMutation,
  useUpdatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useGetSubscriptionPlansQuery,
  useAccessSubscriptionMutation,
  // Analytics Dashboard APIs
  useGetUsersCountQuery,
  useGetActiveUsersQuery,
  useGetRevenueDataQuery,
} = adminApi
