import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { readLangCookie } from '../utils/globalUtils'
import {
  onMutationStartedDefault,
  onQueryStartedDefault,
} from './serviceUtility'

// Type imports
import type {
  LoginRequest,
  LoginResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
  LoggedUserResponse,
  BuyPremiumSubscriptionRequest,
  BuyPremiumSubscriptionResponse,
} from './admin.type'

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
      if (languePref) headers.set('language', languePref)

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
  ],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: `/user-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    oAuthLogin: builder.mutation<OAuthLoginResponse, OAuthLoginRequest>({
      query: (data) => ({
        url: `/user-api/auth/oauth-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (postData) => ({
        url: `/user-api/auth/logout`,
        method: 'POST',
        body: postData,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (data) => ({
        url: '/user-api/auth/signup',
        method: 'post',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    loggedUser: builder.query<LoggedUserResponse, void>({
      query: () => '/user-api/auth/me',
      keepUnusedDataFor: 0,
      providesTags: ['Me'],
      onQueryStarted: onQueryStartedDefault,
    }),
    buyPremiumSubscription: builder.mutation<BuyPremiumSubscriptionResponse, BuyPremiumSubscriptionRequest>({
      query: (data) => ({
        url: `/user-api/user-actions/buy-premium-subscription`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    forgetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/user-api/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/user-api/user-actions/change-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    emailVerification: builder.query<any, any>({
      query: (body) => ({
        url: `/user-api/auth/email-verification`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resendEmail: builder.mutation<any, any>({
      query: (data) => ({
        url: `user-api/auth/resend-verification-email`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    profileActions: builder.mutation<any, any>({
      query: (payload) => ({
        url: `/user-api/user-actions/edit-profile`,
        method: 'PUT',
        body: payload,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Me'],
    }),
    createPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/user-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getInvoiceDetails: builder.query<any, any>({
      query: (data) => ({
        url: '/user-api/user-actions/get-invoices',
        method: 'GET',
        params: data,
      }),
      transformResponse: (response: any) => response.data || [],
    }),
    downloadPdf: builder.query({
      query: (data) => ({
        url: '/user-api/user-actions/download-invoice',
        method: 'GET',
        params: data as Record<string, unknown>,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    cancelSubscription: builder.mutation<any, any>({
      query: (data) => ({
        url: '/user-api/user-actions/cancel-subscription',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    feedback: builder.mutation<any, any>({
      query: (data) => ({
        url: `/user-api/feedback/submit`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUserProfile: builder.query<any, any>({
      query: ({ userId }) => ({
        url: `/user-api/user-actions/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
      onQueryStarted: onQueryStartedDefault,
    }),
    myProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/user-api/user-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStartedDefault,
    }),
    submitFeedback: builder.mutation<any, any>({
      query: (data) => ({
        url: '/user-api/feedback/submit',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    setUserAppearance: builder.mutation<any, any>({
      query: (data) => ({
        url: `/user-api/user-actions/set-user-appearance`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUserExperiences: builder.query<any, any>({
      query: (body) => ({
        url: `/user-api/user-actions/get-signup-preferences`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    // Education auth
    getEducationAuthToken: builder.query<any, any>({
      query: (params) => ({
        url: `/user-api/auth/data-encryption`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationTutorApplication: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-educators-applications`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Tutor'],
    }),
    getApprovedTutor: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-approved-educators`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['ApprovedTutors'],
    }),
    approveEducatorStatus: builder.mutation<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/approve-educator-status`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    inviteEducator: builder.mutation<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/invite-educators`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    registerEducator: builder.mutation<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/register-educator`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    resendInvitation: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/admin-panel/resend-invitations`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorForgetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/onboarding/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorResetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/onboarding/educator-reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogout: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-logout`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogin: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    reconsiderStatus: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/admin-panel/reconsider-declined-educators`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    createCourse: builder.mutation<any, any>({
      query: (data) => ({
        url: `/education-api/onboarding/add-course`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getLessonsDetails: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/get-lessons-of-chapter`,
        method: 'GET',
        params,
      }),
      providesTags: (_, __, arg) => [
        {
          type: 'Lessons',
          id: `${(arg as any)?.courseId}${(arg as any)?.chapterId}`,
        },
      ],
      onQueryStarted: onQueryStartedDefault,
    }),
    viewTutorDetail: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-particular-educator-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadCV: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-cv-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    watchVideo: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-intro-video-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    addCourseMetaData: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/add-meta-data-of-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    addCourseChapter: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/add-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Chapters'],
    }),
    listChapers: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Chapters'],
    }),
    addLesson: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/add-lesson`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAwsUrlForUpload: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    successForVideoUpload: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/success-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateChapter: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/update-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Chapters'],
    }),
    updateLesson: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/update-lesson`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        {
          type: 'Lessons',
          id: `${(arg as any).courseId}${(arg as any).chapterId}`,
        },
      ],
    }),
    downloadResource: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-of-resource`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    coursePreview: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/get-preview-of-course`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    sortChapters: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/sort-chapters`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    sortLesson: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/sort-lessons`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateCourse: builder.mutation<any, any>({
      query: (body) => ({
        url: `/education-api/onboarding/update-my-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Courses'],
    }),
    getAllWebinar: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/get-all-webinars`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCourses: builder.query<any, any>({
      query: (params) => ({
        url: `/education-api/onboarding/get-my-courses`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getCoursesCount: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/get-courses-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getWebinarsCount: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/get-webinars-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getPaymentHistory: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/get-my-payments`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response: any) => response.data || [],
    }),
    generateInvoice: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/get-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    verifyEducatorEmail: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/email-exist`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    createWebinar: builder.mutation<any, any>({
      query: (data) => ({
        url: `education-api/onboarding/add-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    updateWebinar: builder.mutation<any, any>({
      query: (data) => ({
        url: `education-api/onboarding/update-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Webinars'],
    }),
    getWebinarDetail: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/onboarding/get-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
    }),
    getWebinarAttachments: builder.query<any, any>({
      query: (data) => ({
        url: `education-api/onboarding/get-webinar-resources`,
        method: 'GET',
        params: data as Record<string, unknown>,
      }),
      keepUnusedDataFor: 0,
    }),
    getPastWebinars: builder.query<any, any>({
      query: (data) => ({
        url: `education-api/onboarding/get-past-webinar-details`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getDisplayScheduleTime: builder.mutation<any, any>({
      query: (body) => ({
        url: `education-api/onboarding/get-timing-of-webinar`,
        method: 'POST',
        body,
      }),
    }),
    getCategoryList: builder.query<any, void>({
      query: () => ({
        url: `education-api/onboarding/get-educator-categories-list`,
        method: 'GET',
      }),
    }),
    languageChange: builder.mutation<any, any>({
      query: (body) => ({
        url: `education-api/onboarding/language-update`,
        method: 'POST',
        body,
      }),
    }),
    educatorAuth: builder.query<any, void>({
      query: () => ({
        url: `education-api/onboarding/get-my-details`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateEducatorDetails: builder.mutation<any, any>({
      query: (body) => ({
        url: `education-api/admin-panel/update-educator-details`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ApprovedTutors'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getWebinarDetails: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/admin-panel/view-educator-profile`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCoursesDetails: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/admin-panel/get-courses-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationAdminInvoice: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/admin-panel/get-all-transactions`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadAdminInvoice: builder.query<any, any>({
      query: (params) => ({
        url: `education-api/admin-panel/get-transactions-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    deleteEducator: builder.mutation<any, any>({
      query: (body) => ({
        url: `education-api/admin-panel/delete-declined-educator`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tutor'],
      onQueryStarted: onMutationStartedDefault,
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
  useResendEmailMutation,
  useMyProfileMutation,
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
} = adminApi