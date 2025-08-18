// Admin API Types

// ============== Authentication Types ==============
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      role?: string
    }
  }
}

export interface OAuthLoginRequest {
  authType: 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN'
  accessToken: string
}

export interface OAuthLoginResponse {
  token: string
}

export interface LogoutRequest {
  token?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  acceptTerms?: boolean
}

export interface SignUpResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
    token?: string
  }
}

// ============== User Management Types ==============
export interface LoggedUserResponse {
  success: boolean
  data: {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
    profilePicture?: string
    role: string
    isEmailVerified: boolean
    isPremium?: boolean
    createdAt?: string
    updatedAt?: string
  }
}

export interface UserProfileRequest {
  userId: string
}

export interface UserProfileResponse extends LoggedUserResponse {}

export interface ProfileActionsRequest {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  profilePicture?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface ProfileActionsResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      phoneNumber?: string
      profilePicture?: string
      updatedAt: string
    }
  }
}

export interface MyProfileRequest extends ProfileActionsRequest {}
export interface MyProfileResponse extends ProfileActionsResponse {}

export interface SetUserAppearanceRequest {
  theme: 'light' | 'dark' | 'auto'
  primaryColor?: string
  fontSize?: 'small' | 'medium' | 'large'
}

export interface SetUserAppearanceResponse {
  success: boolean
  message: string
}

export interface GetUserExperiencesRequest {
  category?: string
}

export interface GetUserExperiencesResponse {
  success: boolean
  data: {
    experiences: Array<{
      id: string
      name: string
      category: string
    }>
  }
}

// ============== Password & Email Types ==============
export interface ForgetPasswordRequest {
  email: string
}

export interface ForgetPasswordResponse {
  success: boolean
  message: string
  data?: {
    resetToken?: string
  }
}

export interface ResetPasswordRequest {
  currentPassword?: string
  newPassword: string
  confirmPassword?: string
  token?: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface CreatePasswordRequest {
  password: string
  confirmPassword: string
  token: string
}

export interface CreatePasswordResponse {
  success: boolean
  message: string
}

export interface EmailVerificationRequest {
  token: string
  email?: string
}

export interface EmailVerificationResponse {
  success: boolean
  message: string
  data?: {
    isVerified: boolean
    email: string
  }
}

export interface ResendEmailRequest {
  email: string
}

export interface ResendEmailResponse {
  success: boolean
  message: string
}

// ============== Subscription Types ==============
export interface BuyPremiumSubscriptionRequest {
  planId: string
  subscriptionType: 'COURSE' | 'WEBINAR'

  nameOnCard?: string
  cardNumber?: string
  expDate?: string
  cardCode?: string

  firstName?: string
  lastName?: string
  country?: string
  state?: string
  city?: string
  zip?: string
  address?: string
  isAgree?: boolean

  courseId?: string
  webinarId?: string
  scheduledDate?: string
}

export interface BuyPremiumSubscriptionResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    subscriptionId: string
    status: string
  }
}

export interface CancelSubscriptionRequest {
  subscriptionId: string
  reason?: string
}

export interface CancelSubscriptionResponse {
  success: boolean
  message: string
}

// ============== Invoice Types ==============
export interface GetInvoiceDetailsRequest {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface Invoice {
  _id: string
  courseId?: {
    _id: string
    title: string
    subtitle: string
    thumbNail: string
  }
  webinarId?: {
    _id: string
    title: string
    thumbNail: string
  }
  moduleType: 'course' | 'webinar'
  educatorId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  userId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  amount: number
  transactionId: string
  createdAt: string
}

export interface GetInvoiceDetailsResponse {
  data: Invoice[]
  total: number
  page: number
  limit: number
}

export interface DownloadPdfRequest {
  invoiceId: string
}

export interface DownloadPdfResponse {
  url: string
}

// ============== Feedback Types ==============
export interface FeedbackRequest {
  title: string
  description: string
  category: 'bug' | 'feature' | 'general'
  rating?: number
}

export interface FeedbackResponse {
  success: boolean
  message: string
}

export interface SubmitFeedbackRequest extends FeedbackRequest {}
export interface SubmitFeedbackResponse extends FeedbackResponse {}

// ============== Educator Types ==============
export interface Educator {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  status: 'pending' | 'approved' | 'rejected'
  expertise?: Array<{ category: string }>
  experience?: number
  bio?: string
  profilePicture?: string
  cv?: string
  introVideo?: string
  createdAt: string
  updatedAt: string
  approvedBy?: {
    _id?: string
    firstName: string
    lastName: string
  }
  approvedDate?: string
  lastLoginAt?: string
  educatorActive?: boolean
}

export interface GetEducationTutorApplicationRequest {
  page?: number
  pageSize?: number
  filter?: 'ALL' | 'DECLINED'
  search?: string
}

export interface GetEducationTutorApplicationResponse {
  message: string
  data: Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    expertise: Array<{ category: string }>
    createdAt: string
    declinedReason?: string
    status?: string
    [key: string]: unknown
  }>
  count: number
  total?: number
  totalPages?: number
  [key: string]: unknown
}

export interface GetApprovedTutorRequest {
  page?: number
  pageSize?: number
  search?: string
}
export interface GetApprovedTutorResponse {
  success: boolean
  data: {
    _id: string
    firstName: string
    lastName: string
    email: string
    expertise?: {
      category: string
    }[]
    lastLoginAt?: string
    approvedDate?: string
    approvedBy?: {
      firstName: string
      lastName: string
    }
  }[]
  count: number
  totalPages?: number
  [key: string]: unknown
}

export interface ApproveEducatorStatusRequest {
  educatorIds: string[]
  approval: boolean
  declinedReason?: string
}

export interface ApproveEducatorStatusResponse {
  success: boolean
  message: string
}

export interface InviteEducatorRequest {
  email: string
  firstName: string
  lastName: string
  message?: string
}

export interface InviteEducatorResponse {
  success: boolean
  message: string
}

export interface RegisterEducatorRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  expertise?: string[]
  experience?: number
  bio?: string
}

export interface RegisterEducatorResponse {
  success: boolean
  message: string
  data?: {
    educatorId: string
    token: string
  }
}

export interface ResendInvitationRequest {
  email: string
}

export interface ResendInvitationResponse {
  success: boolean
  message: string
}

export interface EducatorForgetPasswordRequest extends ForgetPasswordRequest {}
export interface EducatorForgetPasswordResponse
  extends ForgetPasswordResponse {}

export interface EducatorResetPasswordRequest extends ResetPasswordRequest {}
export interface EducatorResetPasswordResponse extends ResetPasswordResponse {}

export interface EducatorLogoutRequest extends LogoutRequest {}
export interface EducatorLogoutResponse extends LogoutResponse {}

export interface EducatorLoginRequest extends LoginRequest {}
export interface EducatorLoginResponse extends LoginResponse {}

export interface ReconsiderStatusRequest {
  educatorId: string
}

export interface ReconsiderStatusResponse {
  success: boolean
  message: string
}

export interface ViewTutorDetailRequest {
  educatorId: string
}

export interface TutorDetailData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  state?: string
  country?: string
  expertise?: Array<{
    category: string
    subcategory?: string
  }>
  totalEarnings?: number
  availableBalance?: number
  education?: Array<{
    degree: string
    field: string
    _id: string
  }>
  certifications?: Array<{
    name: string
    organization: string
    _id: string
  }>
  hau?: string
  company?: string
  summary?: string
  experience?: number
  linkedinUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  language?: string
  otherProfileUrls?: string[]
  status?: string
  educatorActive?: boolean
  cvPath?: string
  videoPath?: string
  cv?: string
  introVideo?: string
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  approvedBy?: {
    _id?: string
    firstName: string
    lastName: string
  }
  approvedDate?: string
  lastLoginAt?: string
  declinedReason?: string
}

export interface ViewTutorDetailResponse {
  message: string
  data: TutorDetailData
}

export interface DownloadCVRequest {
  educatorId: string
}

export interface DownloadCVResponse {
  url: string
}

export interface WatchVideoRequest {
  educatorId: string
}

export interface WatchVideoResponse {
  url: string
}

export interface UpdateEducatorDetailsRequest {
  educatorId: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  expertise?: string[]
  experience?: number
  bio?: string
}

export interface UpdateEducatorDetailsResponse {
  success: boolean
  message: string
}

export interface DeleteEducatorRequest {
  educatorId: string
}

export interface DeleteEducatorResponse {
  success: boolean
  message: string
}

export interface EducatorAuthResponse {
  success: boolean
  data: Educator
}

export interface GetEducationAuthTokenRequest {
  type: string
}

export interface GetEducationAuthTokenResponse {
  token: string
}

// ============== Course Types ==============
export interface Course {
  _id: string
  title: string
  description: string
  price: number
  thumbnail?: string
  duration: number
  category: string
  chapters?: Chapter[]
  educatorId: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  _id: string
  title: string
  description: string
  order: number
  lessons?: Lesson[]
}

export interface Lesson {
  _id: string
  title: string
  description: string
  type: 'video' | 'text' | 'quiz'
  content: string
  duration?: number
  resources?: string[]
  order: number
}

export interface CreateCourseRequest {
  title: string
  description: string
  price: number
  category: string
  thumbnail?: string
}

export interface CreateCourseResponse {
  success: boolean
  message: string
  data?: {
    courseId: string
  }
}

export interface AddCourseMetaDataRequest {
  courseId: string
  tags?: string[]
  objectives?: string[]
  requirements?: string[]
  targetAudience?: string[]
}

export interface AddCourseMetaDataResponse {
  success: boolean
  message: string
}

export interface AddCourseChapterRequest {
  courseId: string
  title: string
  description: string
  order?: number
}

export interface AddCourseChapterResponse {
  success: boolean
  message: string
  data?: {
    chapterId: string
  }
}

export interface ListChaptersRequest {
  courseId: string
}

export interface ListChaptersResponse {
  success: boolean
  data: Course
}

export interface AddLessonRequest {
  courseId: string
  chapterId: string
  title: string
  description: string
  type: 'video' | 'text' | 'quiz'
  content: string
  duration?: number
  order?: number
}

export interface AddLessonResponse {
  success: boolean
  message: string
  data?: {
    lessonId: string
  }
}

export interface GetLessonsDetailsRequest {
  courseId: string
  chapterId: string
}

export interface GetLessonsDetailsResponse {
  success: boolean
  data: Lesson[]
}

export interface UpdateChapterRequest {
  courseId: string
  chapterId: string
  title?: string
  description?: string
  order?: number
}

export interface UpdateChapterResponse {
  success: boolean
  message: string
}

export interface UpdateLessonRequest {
  courseId: string
  chapterId: string
  lessonId: string
  title?: string
  description?: string
  content?: string
  duration?: number
  order?: number
}

export interface UpdateLessonResponse {
  success: boolean
  message: string
}

export interface SortChaptersRequest {
  courseId: string
  chapterIds: string[]
}

export interface SortChaptersResponse {
  success: boolean
  message: string
}

export interface SortLessonRequest {
  courseId: string
  chapterId: string
  lessonIds: string[]
}

export interface SortLessonResponse {
  success: boolean
  message: string
}

export interface UpdateCourseRequest {
  courseId: string
  title?: string
  description?: string
  price?: number
  category?: string
  thumbnail?: string
  status?: 'draft' | 'published' | 'archived'
  isDeleted?: boolean
}

export interface UpdateCourseResponse {
  success: boolean
  message: string
}

export interface GetAllCoursesRequest {
  page?: number
  pageSize?: number
  searchTerm?: string
  category?: string
  status?: string
}

export interface EducatorCourse {
  _id: string
  educatorId: string
  title: string
  subtitle: string
  description: string
  category: string[]
  status: 'draft' | 'published' | 'archived'
  isPaid: boolean
  price: number
  totalPurchased: number
  totalEarnings: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
  previewVideo?: string
  thumbNail?: string
}

export interface GetAllCoursesResponse {
  message: string
  data: {
    courses: EducatorCourse[]
    count: number
  }
}

export interface GetCoursesCountRequest {
  status?: string
}

export interface GetCoursesCountResponse {
  message: string
  data: {
    courseCount: number
    publishedCourseCount: number
    draftCourseCount: number
  }
}

export interface CoursePreviewRequest {
  courseId: string
}

export interface CoursePreviewResponse {
  success: boolean
  data: Course
}

export interface GetAllCoursesDetailsRequest {
  educatorId: string
  page?: number
  limit?: number
}

export interface TutorCourseDetail {
  _id: string
  thumbNail: string
  title: string
  description: string
  category: string[]
  price: number
  totalPurchased: number
  educatorId?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface GetAllCoursesDetailsResponse {
  message?: string
  data: {
    courses: TutorCourseDetail[]
    count: number
    totalPages?: number
  }
}

// ============== Upload Types ==============
export interface GetAwsUrlForUploadRequest {
  fileName: string
  fileType: string
  category: 'video' | 'image' | 'document'
}

export interface GetAwsUrlForUploadResponse {
  uploadUrl: string
  fileKey: string
}

export interface SuccessForVideoUploadRequest {
  fileKey: string
  courseId?: string
  chapterId?: string
  lessonId?: string
}

export interface SuccessForVideoUploadResponse {
  success: boolean
  message: string
}

export interface DownloadResourceRequest {
  resourceId: string
}

export interface DownloadResourceResponse {
  url: string
}

// ============== Webinar Types ==============
export interface Webinar {
  _id: string
  title: string
  description: string
  thumbnail?: string
  startTime: string
  endTime: string
  duration: number
  price: number
  category: string
  educatorId: string
  status: 'draft' | 'scheduled' | 'live' | 'completed'
  maxParticipants?: number
  registeredCount?: number
  resources?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateWebinarRequest {
  title: string
  description: string
  startTime: string
  endTime: string
  price: number
  category: string
  maxParticipants?: number
  thumbnail?: string
}

export interface CreateWebinarResponse {
  success: boolean
  message: string
  data?: {
    webinarId: string
  }
}

export interface UpdateWebinarRequest {
  webinarId: string
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  price?: number
  category?: string
  maxParticipants?: number
  thumbnail?: string
  status?: 'draft' | 'scheduled' | 'live' | 'completed'
}

export interface UpdateWebinarResponse {
  success: boolean
  message: string
}

export interface GetAllWebinarRequest {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}

export interface GetAllWebinarResponse {
  success: boolean
  data: Webinar[]
  total: number
  page: number
  limit: number
}

export interface GetWebinarsCountRequest {
  status?: string
}

export interface GetWebinarsCountResponse {
  total: number
  draft: number
  scheduled: number
  live: number
  completed: number
}

export interface GetWebinarDetailRequest {
  webinarId: string
}

export interface GetWebinarDetailResponse {
  success: boolean
  data: Webinar
}

export interface GetWebinarAttachmentsRequest {
  webinarId: string
}

export interface GetWebinarAttachmentsResponse {
  success: boolean
  data: string[]
}

export interface GetPastWebinarsRequest {
  page?: number
  limit?: number
}

export interface GetPastWebinarsResponse {
  success: boolean
  data: Webinar[]
  total: number
  page: number
  limit: number
}

export interface GetDisplayScheduleTimeRequest {
  webinarId: string
  timezone?: string
}

export interface GetDisplayScheduleTimeResponse {
  startTime: string
  endTime: string
  timezone: string
}

export interface GetWebinarDetailsRequest {
  educatorId: string
  page?: number
  limit?: number
  size?: number
}

export interface TutorWebinarDetail {
  _id: string
  educatorId: string
  title: string
  description: string
  category: string[]
  status: string
  isPaid: boolean
  price: number
  thumbnail?: string
  thumbNail?: string
  resources: string[]
  totalEnrolled: number
  totalEarnings: number
  scheduleType: string
  startDate?: string
  startTime?: string
  endTime?: string
  isPrivate: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface GetWebinarDetailsResponse {
  message: string
  webinars: TutorWebinarDetail[]
  count?: number
  totalPages?: number
}

// ============== Payment History Types ==============
export interface GetPaymentHistoryRequest {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface Payment {
  id: string
  amount: number
  date: string
  status: 'success' | 'pending' | 'failed'
  type: 'course' | 'webinar' | 'subscription'
  description: string
}

export interface GetPaymentHistoryResponse {
  data: Payment[]
  total: number
  page: number
  limit: number
}

export interface GenerateInvoiceRequest {
  paymentId: string
}

export interface GenerateInvoiceResponse {
  url: string
}

export interface GetEducationAdminInvoiceRequest {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

export interface GetEducationAdminInvoiceResponse {
  message: string
  data: {
    data: Invoice[]
    count: number
  }
}

export interface DownloadAdminInvoiceRequest {
  transactionId: string
}

export interface DownloadAdminInvoiceResponse {
  message: string
  data: string
}

// ============== Category Types ==============
export interface GetCategoryListResponse {
  success: boolean
  data: string[]
}

// ============== Language Types ==============
export interface LanguageChangeRequest {
  language: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'
}

export interface LanguageChangeResponse {
  success: boolean
  message: string
}

// ============== Email Verification Types ==============
export interface VerifyEducatorEmailRequest {
  email: string
}

export interface VerifyEducatorEmailResponse {
  exists: boolean
  verified: boolean
}
