import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { readLangCookie } from '../utils/globalUtils'
import {
  onMutationStartedDefault,
  onQueryStartedDefault,
} from './serviceUtility'

import type {
  // Authentication
  LoginRequest,
  LoginResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
  // User Management
  LoggedUserResponse,
  MyProfileRequest,
  MyProfileResponse,

  // Password & Email
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  ResendEmailRequest,
  ResendEmailResponse,
  // Subscription
  BuyPremiumSubscriptionRequest,
  BuyPremiumSubscriptionResponse,

  // Educator Management
  GetEducationTutorApplicationRequest,
  GetEducationTutorApplicationResponse,
  GetApprovedTutorRequest,
  GetApprovedTutorResponse,
  ApproveEducatorStatusRequest,
  ApproveEducatorStatusResponse,
  InviteEducatorRequest,
  InviteEducatorResponse,
  RegisterEducatorRequest,
  RegisterEducatorResponse,
  EducatorForgetPasswordRequest,
  EducatorForgetPasswordResponse,
  EducatorResetPasswordRequest,
  EducatorResetPasswordResponse,
  EducatorLogoutRequest,
  EducatorLogoutResponse,
  EducatorLoginRequest,
  EducatorLoginResponse,
  ReconsiderStatusRequest,
  ReconsiderStatusResponse,
  ViewTutorDetailRequest,
  ViewTutorDetailResponse,
  DownloadCVRequest,
  DownloadCVResponse,
  WatchVideoRequest,
  WatchVideoResponse,
  DeleteEducatorRequest,
  DeleteEducatorResponse,
  EducatorAuthResponse,

  // Course Management
  CreateCourseRequest,
  CreateCourseResponse,
  AddCourseMetaDataRequest,
  AddCourseMetaDataResponse,
  AddCourseChapterRequest,
  AddCourseChapterResponse,
  ListChaptersRequest,
  ListChaptersResponse,
  AddLessonRequest,
  AddLessonResponse,
  GetLessonsDetailsRequest,
  GetLessonsDetailsResponse,
  UpdateChapterRequest,
  UpdateChapterResponse,
  UpdateLessonRequest,
  UpdateLessonResponse,
  SortChaptersRequest,
  SortChaptersResponse,
  SortLessonRequest,
  SortLessonResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
  GetAllCoursesRequest,
  GetAllCoursesResponse,
  GetCoursesCountRequest,
  GetCoursesCountResponse,
  CoursePreviewRequest,
  CoursePreviewResponse,
  GetAllCoursesDetailsRequest,
  GetAllCoursesDetailsResponse,
  // Upload
  GetAwsUrlForUploadRequest,
  GetAwsUrlForUploadResponse,
  SuccessForVideoUploadRequest,
  SuccessForVideoUploadResponse,
  DownloadResourceRequest,
  DownloadResourceResponse,
  // Webinar Management
  CreateWebinarRequest,
  CreateWebinarResponse,
  UpdateWebinarRequest,
  UpdateWebinarResponse,
  GetAllWebinarRequest,
  GetAllWebinarResponse,
  GetWebinarsCountRequest,
  GetWebinarsCountResponse,
  GetWebinarDetailRequest,
  GetWebinarDetailResponse,
  GetWebinarAttachmentsRequest,
  GetWebinarAttachmentsResponse,
  GetPastWebinarsRequest,
  GetPastWebinarsResponse,
  GetDisplayScheduleTimeRequest,
  GetDisplayScheduleTimeResponse,
  GetWebinarDetailsRequest,
  GetWebinarDetailsResponse,
  // Payment History
  GetPaymentHistoryRequest,
  GetPaymentHistoryResponse,
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  GetEducationAdminInvoiceRequest,
  GetEducationAdminInvoiceResponse,
  DownloadAdminInvoiceRequest,
  DownloadAdminInvoiceResponse,
  // Category
  GetCategoryListResponse,

  // Email Verification
  VerifyEducatorEmailRequest,
  VerifyEducatorEmailResponse,
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
    buyPremiumSubscription: builder.mutation<
      BuyPremiumSubscriptionResponse,
      BuyPremiumSubscriptionRequest
    >({
      query: (data) => ({
        url: `/user-api/user-actions/buy-premium-subscription`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    forgetPassword: builder.mutation<
      ForgetPasswordResponse,
      ForgetPasswordRequest
    >({
      query: (data) => ({
        url: `/user-api/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: `/user-api/user-actions/change-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    emailVerification: builder.query<
      EmailVerificationResponse,
      EmailVerificationRequest
    >({
      query: (body) => ({
        url: `/user-api/auth/email-verification`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resendEmail: builder.mutation<ResendEmailResponse, ResendEmailRequest>({
      query: (data) => ({
        url: `user-api/auth/resend-verification-email`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    myProfile: builder.mutation<MyProfileResponse, MyProfileRequest>({
      query: (data) => ({
        url: '/user-api/user-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStartedDefault,
    }),

    // admin-panel educator section
    getEducationTutorApplication: builder.query<
      GetEducationTutorApplicationResponse,
      GetEducationTutorApplicationRequest
    >({
      query: (params) => ({
        url: `/education-api/admin-panel/get-educators-applications`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Tutor'],
    }),
    getApprovedTutor: builder.query<
      GetApprovedTutorResponse,
      GetApprovedTutorRequest
    >({
      query: (params) => ({
        url: `/education-api/admin-panel/get-approved-educators`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['ApprovedTutors'],
    }),
    approveEducatorStatus: builder.mutation<
      ApproveEducatorStatusResponse,
      ApproveEducatorStatusRequest
    >({
      query: (params) => ({
        url: `/education-api/admin-panel/approve-educator-status`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    inviteEducator: builder.mutation<
      InviteEducatorResponse,
      InviteEducatorRequest
    >({
      query: (params) => ({
        url: `/education-api/admin-panel/invite-educators`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    registerEducator: builder.mutation<
      RegisterEducatorResponse,
      RegisterEducatorRequest
    >({
      query: (params) => ({
        url: `/education-api/onboarding/register-educator`,
        method: 'POST',
        body: params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),

    educatorForgetPassword: builder.mutation<
      EducatorForgetPasswordResponse,
      EducatorForgetPasswordRequest
    >({
      query: (data) => ({
        url: `/education-api/onboarding/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorResetPassword: builder.mutation<
      EducatorResetPasswordResponse,
      EducatorResetPasswordRequest
    >({
      query: (data) => ({
        url: `/education-api/onboarding/educator-reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogout: builder.mutation<
      EducatorLogoutResponse,
      EducatorLogoutRequest
    >({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-logout`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    educatorLogin: builder.mutation<
      EducatorLoginResponse,
      EducatorLoginRequest
    >({
      query: (data) => ({
        url: `/education-api/onboarding/educator-panel-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    reconsiderStatus: builder.mutation<
      ReconsiderStatusResponse,
      ReconsiderStatusRequest
    >({
      query: (data) => ({
        url: `/education-api/admin-panel/reconsider-declined-educators`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Tutor'],
    }),
    createCourse: builder.mutation<CreateCourseResponse, CreateCourseRequest>({
      query: (data) => ({
        url: `/education-api/onboarding/add-course`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getLessonsDetails: builder.query<
      GetLessonsDetailsResponse,
      GetLessonsDetailsRequest
    >({
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
      onQueryStarted: onQueryStartedDefault,
    }),
    viewTutorDetail: builder.query<
      ViewTutorDetailResponse,
      ViewTutorDetailRequest
    >({
      query: (params) => ({
        url: `/education-api/admin-panel/get-particular-educator-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadCV: builder.query<DownloadCVResponse, DownloadCVRequest>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-cv-of-educator`,
        method: 'GET',
        params,
      }),
    }),
    watchVideo: builder.query<WatchVideoResponse, WatchVideoRequest>({
      query: (params) => ({
        url: `/education-api/admin-panel/get-intro-video-of-educator`,
        method: 'GET',
        params,
      }),
    }),
    addCourseMetaData: builder.mutation<
      AddCourseMetaDataResponse,
      AddCourseMetaDataRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/add-meta-data-of-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    addCourseChapter: builder.mutation<
      AddCourseChapterResponse,
      AddCourseChapterRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/add-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Chapters'],
    }),
    listChapers: builder.query<ListChaptersResponse, ListChaptersRequest>({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Chapters'],
    }),
    addLesson: builder.mutation<AddLessonResponse, AddLessonRequest>({
      query: (body) => ({
        url: `/education-api/onboarding/add-lesson`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAwsUrlForUpload: builder.mutation<
      GetAwsUrlForUploadResponse,
      GetAwsUrlForUploadRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    successForVideoUpload: builder.mutation<
      SuccessForVideoUploadResponse,
      SuccessForVideoUploadRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/success-for-video-upload`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateChapter: builder.mutation<
      UpdateChapterResponse,
      UpdateChapterRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/update-chapter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Chapters'],
    }),
    updateLesson: builder.mutation<UpdateLessonResponse, UpdateLessonRequest>({
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
    downloadResource: builder.mutation<
      DownloadResourceResponse,
      DownloadResourceRequest
    >({
      query: (body) => ({
        url: `/education-api/onboarding/get-signed-url-of-resource`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    coursePreview: builder.query<CoursePreviewResponse, CoursePreviewRequest>({
      query: (params) => ({
        url: `/education-api/onboarding/get-preview-of-course`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    sortChapters: builder.mutation<SortChaptersResponse, SortChaptersRequest>({
      query: (body) => ({
        url: `/education-api/onboarding/sort-chapters`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    sortLesson: builder.mutation<SortLessonResponse, SortLessonRequest>({
      query: (body) => ({
        url: `/education-api/onboarding/sort-lessons`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    updateCourse: builder.mutation<UpdateCourseResponse, UpdateCourseRequest>({
      query: (body) => ({
        url: `/education-api/onboarding/update-my-course`,
        method: 'POST',
        body,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Courses'],
    }),
    getAllWebinar: builder.query<GetAllWebinarResponse, GetAllWebinarRequest>({
      query: (params) => ({
        url: `/education-api/onboarding/get-all-webinars`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCourses: builder.query<GetAllCoursesResponse, GetAllCoursesRequest>({
      query: (params) => ({
        url: `/education-api/onboarding/get-my-courses`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getCoursesCount: builder.query<
      GetCoursesCountResponse,
      GetCoursesCountRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/get-courses-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getWebinarsCount: builder.query<
      GetWebinarsCountResponse,
      GetWebinarsCountRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/get-webinars-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getPaymentHistory: builder.query<
      GetPaymentHistoryResponse,
      GetPaymentHistoryRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/get-my-payments`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response: GetPaymentHistoryResponse) => ({
        data: response.data || [],
      }),
    }),
    generateInvoice: builder.query<
      GenerateInvoiceResponse,
      GenerateInvoiceRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/get-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    verifyEducatorEmail: builder.query<
      VerifyEducatorEmailResponse,
      VerifyEducatorEmailRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/email-exist`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    createWebinar: builder.mutation<
      CreateWebinarResponse,
      CreateWebinarRequest
    >({
      query: (data) => ({
        url: `education-api/onboarding/add-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    updateWebinar: builder.mutation<
      UpdateWebinarResponse,
      UpdateWebinarRequest
    >({
      query: (data) => ({
        url: `education-api/onboarding/update-webinar`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Webinars'],
    }),
    getWebinarDetail: builder.query<
      GetWebinarDetailResponse,
      GetWebinarDetailRequest
    >({
      query: (params) => ({
        url: `education-api/onboarding/get-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
    }),
    getWebinarAttachments: builder.query<
      GetWebinarAttachmentsResponse,
      GetWebinarAttachmentsRequest
    >({
      query: (data) => ({
        url: `education-api/onboarding/get-webinar-resources`,
        method: 'GET',
        params: data,
      }),
      keepUnusedDataFor: 0,
    }),
    getPastWebinars: builder.query<
      GetPastWebinarsResponse,
      GetPastWebinarsRequest
    >({
      query: (data) => ({
        url: `education-api/onboarding/get-past-webinar-details`,
        method: 'GET',
        params: data,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getDisplayScheduleTime: builder.mutation<
      GetDisplayScheduleTimeResponse,
      GetDisplayScheduleTimeRequest
    >({
      query: (body) => ({
        url: `education-api/onboarding/get-timing-of-webinar`,
        method: 'POST',
        body,
      }),
    }),
    getCategoryList: builder.query<GetCategoryListResponse, void>({
      query: () => ({
        url: `education-api/onboarding/get-educator-categories-list`,
        method: 'GET',
      }),
    }),

    educatorAuth: builder.query<EducatorAuthResponse, void>({
      query: () => ({
        url: `education-api/onboarding/get-my-details`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    getWebinarDetails: builder.query<
      GetWebinarDetailsResponse,
      GetWebinarDetailsRequest
    >({
      query: (params) => ({
        url: `education-api/admin-panel/view-educator-profile`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCoursesDetails: builder.query<
      GetAllCoursesDetailsResponse,
      GetAllCoursesDetailsRequest
    >({
      query: (params) => ({
        url: `education-api/admin-panel/get-courses-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationAdminInvoice: builder.query<
      GetEducationAdminInvoiceResponse,
      GetEducationAdminInvoiceRequest
    >({
      query: (params) => ({
        url: `education-api/admin-panel/get-all-transactions`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadAdminInvoice: builder.query<
      DownloadAdminInvoiceResponse,
      DownloadAdminInvoiceRequest
    >({
      query: (params) => ({
        url: `education-api/admin-panel/get-transactions-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    deleteEducator: builder.mutation<
      DeleteEducatorResponse,
      DeleteEducatorRequest
    >({
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
