import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { readLangCookie } from '../Utils/globalUtils'
import {
  onQueryStarted,
  onMutationStarted,
  onQueryStartedDefault,
  onMutationStartedDefault,
} from './serviceUtility'

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
  tagTypes: ['Layouts', 'Webinars'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    oAuthLogin: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/oauth-login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    logout: builder.mutation({
      query: (postData) => ({
        url: `/user-api/auth/logout`,
        method: 'POST',
        body: { ...postData },
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: '/user-api/auth/signup',
        method: 'post',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    loggedUser: builder.query({
      query: () => '/user-api/auth/me',
      keepUnusedDataFor: 0,
      providesTags: ['Me'],
      onQueryStarted,
    }),
    partner: builder.mutation({
      query: (data) => ({
        url: '/user-api/partner/create-partner',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    recentlyViewed: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/add-user-activity`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['partners'],
    }),
    // custom layout
    getLayoutTabs: builder.query({
      query: () => ({
        url: `/user-api/layout/get-user-layouts`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Layouts'],
    }),
    addLayout: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/add-layout`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getLayoutComponents: builder.query({
      query: (payload) => ({
        url: `/user-api/layout/get-layout-components`,
        method: 'GET',
        params: { ...payload },
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),
    createDefaultLayout: builder.mutation({
      query: (body) => ({
        url: `/user-api/layout/create-default-layouts`,
        method: 'POST',
        body,
      }),
    }),
    saveLayout: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/edit-layout-components`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    saveOrder: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/reorder-layout`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Layouts'],
      onQueryStarted: onMutationStartedDefault,
    }),
    renameLayout: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/rename-layout`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Layouts'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deleteLayout: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/delete-layout`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Layouts'],
      onQueryStarted: onMutationStartedDefault,
    }),
    saveChatLayout: builder.mutation({
      query: (data) => ({
        url: `/user-api/layout/save-chat-layout`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Layouts'],
      onQueryStarted: onMutationStartedDefault,
    }),
    buyPremiumSubscription: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/buy-premium-subscription`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUsersList: builder.query({
      query: (data) => ({
        url: `/user-api/user-actions/get-all-users`,
        method: 'GET',
        params: { ...data },
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/user-actions/change-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    emailVerification: builder.query({
      query: (body) => ({
        url: `/user-api/auth/email-verification`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    resendEmail: builder.mutation({
      query: (data) => ({
        url: `user-api/auth/resend-verification-email`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    profileActions: builder.mutation({
      query: (payload) => ({
        url: `/user-api/user-actions/edit-profile`,
        method: 'PUT',
        body: payload,
      }),
      onQueryStarted: onMutationStartedDefault,
      invalidatesTags: ['Me'],
    }),
    createPassword: builder.mutation({
      query: (data) => ({
        url: `/user-api/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getSubscriptionDetails: builder.query({
      query: (data) => ({
        url: '/user-api/user-actions/get-particular-subscription',
        method: 'GET',
        params: { ...data },
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
      providesTags: ['Subscription'],
      onQueryStarted: onQueryStartedDefault,
    }),
    getInvoiceDetails: builder.query({
      query: (data) => ({
        url: '/user-api/user-actions/get-invoices',
        method: 'GET',
        params: { ...data },
      }),
      transformResponse: (response) => response.data,
    }),
    downloadPdf: builder.query({
      query: (data) => ({
        url: '/user-api/user-actions/download-invoice',
        method: 'GET',
        params: { ...data },
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/cancel-subscription',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    // Zoom Api's
    authenticateZoom: builder.mutation({
      query: (payload) => ({
        url: `/user-api/zoom/auth`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Me'],
      onQueryStarted: onMutationStartedDefault,
    }),
    deAuthenticateZoom: builder.mutation({
      query: (payload) => ({
        url: `/user-api/zoom/deauthenticate`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Me'],
      onQueryStarted: onMutationStartedDefault,
    }),
    createZoomMeeting: builder.mutation({
      query: (payload) => ({
        url: `/user-api/zoom/create-meeting`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Zoom-meetings'],
      onQueryStarted: onMutationStartedDefault,
    }),
    joinZoomMeeting: builder.query({
      query: (payload) => ({
        url: `/user-api/zoom/join-meeting`,
        method: 'GET',
        params: { ...payload },
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onMutationStarted,
    }),
    zoomMeetings: builder.query({
      query: (payload) => ({
        url: `/user-api/zoom/list-meetings`,
        method: 'GET',
        params: { ...payload },
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Zoom-meetings'],
      onQueryStarted: onMutationStartedDefault,
    }),
    feedback: builder.mutation({
      query: (data) => ({
        url: `/user-api/feedback/submit`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getUserProfile: builder.query({
      query: ({ userId }) => ({
        url: `/user-api/user-actions/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
      onQueryStarted: onQueryStartedDefault,
    }),
    myProfile: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
      onQueryStarted: onMutationStartedDefault,
    }),
    submitFeedback: builder.mutation({
      query: (data) => ({
        url: '/user-api/feedback/submit',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    tourGuide: builder.mutation({
      query: (data) => ({
        url: '/user-api/auth/tour-guide-update',
        method: 'POST',
        body: data,
      }),
    }),
    getUserCoupons: builder.query({
      query: (body) => ({
        url: `/user-api/user-actions/get-coupons`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getDiscountPrice: builder.query({
      query: (body) => ({
        url: `/user-api/user-actions/get-discount-price`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    tradePulseFreeTrial: builder.mutation({
      query: (data) => ({
        url: '/user-api/user-actions/skip-free-trial',
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
    getUserExperiences: builder.query({
      query: (body) => ({
        url: `/user-api/user-actions/get-signup-preferences`,
        method: 'GET',
        params: body,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    // Education auth
    getEducationAuthToken: builder.query({
      query: (params) => ({
        url: `/user-api/auth/data-encryption`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationTutorApplication: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-educators-applications`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Tutor'],
    }),
    getApprovedTutor: builder.query({
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
    getCourseDetails: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
    getLessonsDetails: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-lessons-of-chapter`,
        method: 'GET',
        params,
      }),
      providesTags: (_, __, { courseId, chapterId }) => [
        { type: 'Lessons', id: `${courseId}${chapterId}` },
      ],
      onQueryStarted: onQueryStartedDefault,
    }),

    viewTutorDetail: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-particular-educator-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    downloadCV: builder.query({
      query: (params) => ({
        url: `/education-api/admin-panel/get-cv-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    watchVideo: builder.query({
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
    listChapers: builder.query({
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
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: (_, __, { courseId, chapterId }) => [
        { type: 'Lessons', id: `${courseId}${chapterId}` },
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
    coursePreview: builder.query({
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
    getAllCourses: builder.query({
      query: (params) => ({
        url: `/education-api/onboarding/get-my-courses`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getCoursesCount: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-courses-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getWebinarsCount: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-webinars-count`,
        method: 'GET',
        params,
      }),
      providesTags: ['Webinars'],
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
    }),
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-my-payments`,
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response) => response.data,
    }),
    generateInvoice: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    verifyEducatorEmail: builder.query({
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

    getWebinarDetail: builder.query({
      query: (params) => ({
        url: `education-api/onboarding/get-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      keepUnusedDataFor: 0,
      providesTags: ['Webinars'],
    }),
    getWebinarAttachments: builder.query({
      query: (data) => ({
        url: `education-api/onboarding/get-webinar-resources`,
        method: 'GET',
        params: { ...data },
      }),
      keepUnusedDataFor: 0,
    }),
    getPastWebinars: builder.query({
      query: (data) => ({
        url: `education-api/onboarding/get-past-webinar-details`,
        method: 'GET',
        params: { ...data },
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
    getCategoryList: builder.query({
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
    getWebinarDetails: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/view-educator-profile`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllCoursesDetails: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/get-courses-of-educator`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationAdminInvoice: builder.query({
      query: (params) => ({
        url: `education-api/admin-panel/get-all-transactions`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response) => response.data,
    }),
    downloadAdminInvoice: builder.query({
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
  useGetLayoutTabsQuery,
  useCreateDefaultLayoutMutation,
  useAddLayoutMutation,
  useGetLayoutComponentsQuery,
  useSaveLayoutMutation, // saving custom layout
  useSaveOrderMutation,
  useRenameLayoutMutation,
  useDeleteLayoutMutation,
  useSaveChatLayoutMutation,
  useBuyPremiumSubscriptionMutation, // buy premium subscription mutation
  useGetUsersListQuery, // get users list
  useEducatorForgetPasswordMutation,
  useForgetPasswordMutation,
  useProfileActionsMutation,
  useResetPasswordMutation,
  useCreatePasswordMutation,
  useEmailVerificationQuery,
  useResendEmailMutation,
  useGetSubscriptionDetailsQuery,
  useGetInvoiceDetailsQuery,
  useLazyDownloadPdfQuery,
  useCancelSubscriptionMutation,
  // Zoom Api's
  useAuthenticateZoomMutation,
  useDeAuthenticateZoomMutation,
  useCreateZoomMeetingMutation,
  useJoinZoomMeetingQuery,
  useZoomMeetingsQuery,
  useFeedbackMutation,
  useMyProfileMutation,
  useSubmitFeedbackMutation,
  useGetUserProfileQuery,
  useTourGuideMutation,
  useGetUserCouponsQuery,
  useLazyGetDiscountPriceQuery,
  useTradePulseFreeTrialMutation,
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
