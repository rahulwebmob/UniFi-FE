import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { readLangCookie } from '../utils/globalUtils'
import {
  onMutationStartedDefault,
  onQueryStartedDefault,
} from './serviceUtility'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  LogoutRequest,
  OAuthLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EmailVerificationParams,
  UserData,
  UserProfileUpdateRequest,
  BuySubscriptionRequest,
  CancelSubscriptionRequest,
  InvoiceParams,
  Invoice,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  PartnerRequest,
  FeedbackRequest,
  ZoomAuthRequest,
  UserActivity,
} from '../types/api.types'
import type {
  TutorDetailsResponse,
  DownloadCVResponse,
  WatchVideoResponse,
} from '../types/admin.types'
import type { CourseData, CourseCountResponse, CoursesResponse, PaymentData, WebinarCountResponse, LessonData, WebinarAttachmentsResponse } from '../types/education.types'

// Define a service using a base URL and expected endpoints
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
    'Layouts',
    'Webinars',
    'Me',
    'partners',
    'Subscription',
    'Zoom-meetings',
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
    oAuthLogin: builder.mutation<LoginResponse, OAuthLoginRequest>({
      query: (data) => ({
        url: `/user-api/auth/oauth-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    logout: builder.mutation<ApiResponse, LogoutRequest>({
      query: (postData) => ({
        url: `/user-api/auth/logout`,
        method: 'POST',
        body: postData,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    signUp: builder.mutation<ApiResponse, SignUpRequest>({
      query: (data) => ({
        url: '/user-api/auth/signup',
        method: 'post',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    loggedUser: builder.query({
      query: () => '/user-api/auth/me',
      keepUnusedDataFor: 0,
      providesTags: ['Me'],
      onQueryStarted: onQueryStartedDefault,
    }),
    partner: builder.mutation<ApiResponse, PartnerRequest>({
      query: (data) => ({
        url: '/user-api/partner/create-partner',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    recentlyViewed: builder.mutation<ApiResponse, UserActivity>({
      query: (data) => ({
        url: `/user-api/user-actions/add-user-activity`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['partners'],
      onQueryStarted: onQueryStartedDefault,
    }),
    // custom layout
    buyPremiumSubscription: builder.mutation<
      ApiResponse,
      BuySubscriptionRequest
    >({
      query: (data) => ({
        url: `/user-api/user-actions/buy-premium-subscription`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getUsersList: builder.query<PaginatedResponse<UserData>, PaginationParams>({
      query: (data) => ({
        url: `/user-api/user-actions/get-all-users`,
        method: 'GET',
        params: data,
      }),
    }),
    forgetPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: `/user-api/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `/user-api/user-actions/change-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    emailVerification: builder.query<ApiResponse, EmailVerificationParams>({
      query: (body) => ({
        url: `/user-api/auth/email-verification`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resendEmail: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: `user-api/auth/resend-verification-email`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    profileActions: builder.mutation<
      ApiResponse<UserData>,
      UserProfileUpdateRequest
    >({
      query: (payload) => ({
        url: `/user-api/user-actions/edit-profile`,
        method: 'PUT',
        body: payload,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Me'],
    }),
    createPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `/user-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    getInvoiceDetails: builder.query<Invoice[], InvoiceParams>({
      query: (data) => ({
        url: '/user-api/user-actions/get-invoices',
        method: 'GET',
        params: data,
      }),
      transformResponse: (response: ApiResponse<Invoice[]>) =>
        response.data || [],
    }),
    downloadPdf: builder.query({
      query: (data) => ({
        url: '/user-api/user-actions/download-invoice',
        method: 'GET',
        params: data as Record<string, unknown>,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    cancelSubscription: builder.mutation<
      ApiResponse,
      CancelSubscriptionRequest
    >({
      query: (data) => ({
        url: '/user-api/user-actions/cancel-subscription',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    // Zoom Api's
    authenticateZoom: builder.mutation<ApiResponse, ZoomAuthRequest>({
      query: (payload) => ({
        url: `/user-api/zoom/auth`,
        method: 'POST',
        body: payload,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Me'],
    }),
    deAuthenticateZoom: builder.mutation<ApiResponse, { userId: string }>({
      query: (payload) => ({
        url: `/user-api/zoom/deauthenticate`,
        method: 'POST',
        body: payload,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Me'],
    }),

    feedback: builder.mutation<ApiResponse, FeedbackRequest>({
      query: (data) => ({
        url: `/user-api/feedback/submit`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUserProfile: builder.query<ApiResponse<UserData>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/user-api/user-actions/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
      onQueryStarted: onQueryStartedDefault,
    }),
    myProfile: builder.mutation<
      ApiResponse<UserData>,
      UserProfileUpdateRequest
    >({
      query: (data) => ({
        url: '/user-api/user-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStartedDefault,
    }),
    submitFeedback: builder.mutation<ApiResponse, FeedbackRequest>({
      query: (data) => ({
        url: '/user-api/feedback/submit',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),

    setUserAppearance: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/set-user-appearance`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUserExperiences: builder.query<ApiResponse, Record<string, unknown>>({
      query: (body) => ({
        url: `/user-api/user-actions/get-signup-preferences`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    // Education auth
    getEducationAuthToken: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/user-api/auth/data-encryption`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationTutorApplication: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-educators-applications`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Tutor'],
    }),
    getApprovedTutor: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-approved-educators`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['ApprovedTutors'],
    }),
    approveEducatorStatus: builder.mutation({
      query: (params) => ({
        url: `/education-api/admin-panel/approve-educator-status`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    inviteEducator: builder.mutation({
      query: (params) => ({
        url: `/education-api/admin-panel/invite-educators`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    registerEducator: builder.mutation({
      query: (params) => ({
        url: `/education-api/onboarding/register-educator`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    resendInvitation: builder.mutation({
      query: (data) => ({
        url: `/education-api/admin-panel/resend-invitations`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorForgetPassword: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorResetPassword: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogout: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-logout`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogin: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    reconsiderStatus: builder.mutation({
      query: (data) => ({
        url: `/education-api/admin-panel/reconsider-declined-educators`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: `/education-api/onboarding/add-course`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getCourseDetails: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getLessonsDetails: builder.query<ApiResponse<LessonData[]>, { courseId?: string; chapterId?: string }>({
      query: (params) => ({
        url: `/education-api/onboarding/get-lessons-of-chapter`,
        method: 'GET',
        params,
      }),
      providesTags: (_, __, arg) => [
        {
          type: 'Lessons',
          id: `${(arg as { courseId?: string; chapterId?: string })?.courseId}${(arg as { courseId?: string; chapterId?: string })?.chapterId}`,
        },
      ],
      onQueryStarted: onQueryStartedDefault,
    }),

    viewTutorDetail: builder.query<TutorDetailsResponse, { educatorId: string | undefined }>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-particular-educator-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadCV: builder.query<DownloadCVResponse, { educatorId: string | undefined }>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-cv-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    watchVideo: builder.query<WatchVideoResponse, { educatorId: string | undefined }>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-intro-video-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    addCourseMetaData: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-meta-data-of-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    addCourseChapter: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Chapters'],
    }),
    listChapers: builder.query<ApiResponse<CourseData>, { courseId?: string }>({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Chapters'],
    }),
    addLesson: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/add-lesson`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAwsUrlForUpload: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    successForVideoUpload: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/success-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateChapter: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/update-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
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
          id: `${(arg as { courseId?: string; chapterId?: string })?.courseId}${(arg as { courseId?: string; chapterId?: string })?.chapterId}`,
        },
      ],
    }),
    downloadResource: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-of-resource`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    coursePreview: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/education-api/onboarding/get-preview-of-course`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    sortChapters: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/sort-chapters`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    sortLesson: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/sort-lessons`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateCourse: builder.mutation({
      query: (body) => ({
        url: `/education-api/onboarding/update-my-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
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
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCourses: builder.query<CoursesResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `/education-api/onboarding/get-my-courses`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getCoursesCount: builder.query<CourseCountResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/get-courses-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getWebinarsCount: builder.query<WebinarCountResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/get-webinars-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getPaymentHistory: builder.query<PaymentData[], Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/get-my-payments`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response: ApiResponse<PaymentData[]>) => response.data,
    }),
    generateInvoice: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/get-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    verifyEducatorEmail: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/email-exist`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    createWebinar: builder.mutation({
      query: (data) => ({
        url: `education-api/onboarding/add-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    updateWebinar: builder.mutation({
      query: (data) => ({
        url: `education-api/onboarding/update-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Webinars'],
    }),

    getWebinarDetail: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/onboarding/get-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
    }),
    getWebinarAttachments: builder.query<WebinarAttachmentsResponse, { webinarId: string }>({
      query: (data) => ({
        url: `education-api/onboarding/get-webinar-resources`,
        method: 'GET',
        params: data as Record<string, unknown>,
      }),
      keepUnusedDataFor: 0,
    }),
    getPastWebinars: builder.query<ApiResponse, Record<string, unknown>>({
      query: (data) => ({
        url: `education-api/onboarding/get-past-webinar-details`,
        method: 'GET',
        params: data as Record<string, unknown>,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getDisplayScheduleTime: builder.mutation({
      query: (body) => ({
        url: `education-api/onboarding/get-timing-of-webinar`,
        method: 'POST',
        body,
      }),
    }),
    getCategoryList: builder.query<ApiResponse, void>({
      query: () => ({
        url: `education-api/onboarding/get-educator-categories-list`,
        method: 'GET',
      }),
    }),
    languageChange: builder.mutation({
      query: (body) => ({
        url: `education-api/onboarding/language-update`,
        method: 'POST',
        body,
      }),
    }),
    educatorAuth: builder.query({
      query: () => ({
        url: `education-api/onboarding/get-my-details`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateEducatorDetails: builder.mutation({
      query: (body) => ({
        url: `education-api/admin-panel/update-educator-details`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ApprovedTutors'],
      onQueryStarted: onMutationStartedDefault,
    }),
    getWebinarDetails: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/admin-panel/view-educator-profile`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCoursesDetails: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/admin-panel/get-courses-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationAdminInvoice: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/admin-panel/get-all-transactions`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: ApiResponse) => response.data,
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadAdminInvoice: builder.query<ApiResponse, Record<string, unknown>>({
      query: (params) => ({
        url: `education-api/admin-panel/get-transactions-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    deleteEducator: builder.mutation({
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
  usePartnerMutation,
  useRecentlyViewedMutation,
  useBuyPremiumSubscriptionMutation,
  useGetUsersListQuery,
  useEducatorForgetPasswordMutation,
  useForgetPasswordMutation,
  useProfileActionsMutation,
  useResetPasswordMutation,
  useCreatePasswordMutation,
  useEmailVerificationQuery,
  useResendEmailMutation,
  useGetInvoiceDetailsQuery,
  useLazyDownloadPdfQuery,
  useCancelSubscriptionMutation,
  // Zoom Api's
  useAuthenticateZoomMutation,
  useDeAuthenticateZoomMutation,
  useFeedbackMutation,
  useMyProfileMutation,
  useSubmitFeedbackMutation,
  useGetUserProfileQuery,

  useSetUserAppearanceMutation,
  useGetUserExperiencesQuery,
  // Education auth
  useGetEducationAuthTokenQuery,
  // education:Tutor Applicationadm
  useGetEducationTutorApplicationQuery,
  // education:Approved Tutor
  useGetApprovedTutorQuery,
  useApproveEducatorStatusMutation,
  useInviteEducatorMutation,
  useRegisterEducatorMutation,
  useResendInvitationMutation,
  useEducatorResetPasswordMutation,
  useEducatorLoginMutation,
  useEducatorLogoutMutation,
  useReconsiderStatusMutation,
  useCreateCourseMutation,
  useGetCourseDetailsQuery,
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
  useLanguageChangeMutation,
  useUpdateEducatorDetailsMutation,
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
  useDeleteEducatorMutation,
  useEducatorAuthQuery,
} = adminApi
