// API Request and Response Types

// Common Types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
  search?: string
  sort?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  statusCode?: number
}

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  user?: UserData
  message?: string
}

export interface OAuthLoginRequest {
  provider: string
  accessToken: string
  idToken?: string
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
  termsAccepted?: boolean
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token?: string
  password: string
  confirmPassword: string
  oldPassword?: string
  update?: string
}

export interface LogoutRequest {
  token?: string
  refreshToken?: string
}

export interface EmailVerificationParams {
  token: string
  email?: string
}

// User Types
export interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  language?: string
  layout?: string[]
  appearance?: UserAppearance
  tourGuide?: boolean
  isEmailVerified?: boolean
  isPremium?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UserAppearance {
  language?: string
  menuPosition?: string
  theme?: 'light' | 'dark'
}

export interface UserProfileUpdateRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  avatar?: string
  language?: string
}

// Subscription Types
export interface SubscriptionDetails {
  id: string
  userId: string
  planName: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  startDate: string
  endDate: string
  price: number
  currency: string
  features: string[]
}

export interface BuySubscriptionRequest {
  planId: string
  couponCode?: string
  paymentMethod: string
}

export interface CancelSubscriptionRequest {
  subscriptionId: string
  reason?: string
}

// Invoice Types
export interface InvoiceParams {
  invoiceId?: string
  startDate?: string
  endDate?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'cancelled'
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Partner Types
export interface PartnerRequest {
  name: string
  email: string
  phone: string
  company: string
  message?: string
}

// Feedback Types
export interface FeedbackRequest {
  subject: string
  message: string
  rating?: number
  category?: string
}

// Zoom Types
export interface ZoomAuthRequest {
  code: string
  redirectUri: string
}

export interface ZoomMeetingRequest {
  topic: string
  type: number
  startTime?: string
  duration?: number
  timezone?: string
  password?: string
  agenda?: string
  settings?: ZoomMeetingSettings
}

export interface ZoomMeetingSettings {
  hostVideo?: boolean
  participantVideo?: boolean
  joinBeforeHost?: boolean
  muteUponEntry?: boolean
  watermark?: boolean
  usePmi?: boolean
  approvalType?: number
  registrationType?: number
  audio?: 'both' | 'telephony' | 'voip'
  autoRecording?: 'local' | 'cloud' | 'none'
}

export interface ZoomMeeting {
  id: string
  topic: string
  type: number
  startTime: string
  duration: number
  timezone: string
  joinUrl: string
  startUrl: string
  password?: string
  hostId: string
  hostEmail: string
  status: string
}

// Education Types
export interface Course {
  id: string
  _id?: string // Support both API formats
  title: string
  description: string
  thumbnail: string
  price: number
  currency: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  instructor: Instructor
  chapters: Chapter[]
  enrollmentCount: number
  rating: number
  isPublished: boolean
  isCourseBought?: boolean
  createdAt: string
  updatedAt: string
  // API response wrapper
  data?: {
    chapters?: Chapter[]
    [key: string]: unknown
  }
}

export interface Chapter {
  id: string
  _id?: string // Support both API formats
  courseId: string
  title: string
  description: string
  order: number
  duration: string
  lessons: Lesson[]
  lessonList?: Lesson[] // alias for lessons
  isPublished: boolean
  url?: string
  contentType?: string
  // API response wrapper
  data?: {
    lessons?: Lesson[]
    lessonList?: Lesson[]
    [key: string]: unknown
  }
}

export interface Lesson {
  id: string
  _id?: string // Support both API formats
  chapterId: string
  title: string
  description: string
  videoUrl?: string
  resourceUrl?: string
  duration: string
  durationInSeconds?: number
  order: number
  isCompleted?: boolean
  isFree?: boolean
  lessonType?: 'video' | 'text' | 'quiz' | 'assignment'
}

export interface Instructor {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
  expertise: string[]
  rating: number
  coursesCount: number
}

export interface Webinar {
  id: string
  _id?: string // Support both API formats
  title: string
  description: string
  thumbnail: string
  startTime: string
  endTime: string
  duration: number
  price: number
  currency: string
  instructor: Instructor
  maxParticipants: number
  currentParticipants: number
  zoomMeetingId?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  resources: WebinarResource[]
  isPublished: boolean
}

export interface WebinarDetail extends Webinar {
  _id?: string
  thumbNail?: string
  subtitle?: string
  educatorId?: unknown
  webinarScheduledObj?: {
    join_date?: string
    can_join?: boolean
    [key: string]: unknown
  }
}

export interface WebinarResource {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface CourseParams extends PaginationParams {
  courseId?: string
  category?: string
  level?: string
  instructorId?: string
  isPublished?: boolean
  searchTerm?: string
  isPurchased?: boolean
  pageSize?: number
  categories?: string
}

export interface ChapterParams {
  courseId: string
  chapterId?: string
  lessonId?: string
}

export interface LessonParams {
  courseId: string
  chapterId: string
  lessonId?: string
}

export interface WebinarParams extends PaginationParams {
  webinarId?: string
  instructorId?: string
  status?: string
  startDate?: string
  endDate?: string
  isPurchased?: boolean
  search?: string
  categories?: string
}

// Educator Types
export interface EducatorApplication {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string[]
  experience: number
  bio: string
  cv: string
  introVideo?: string
  status: 'pending' | 'approved' | 'declined' | 'reconsidering'
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
}

export interface EducatorStatusRequest {
  educatorId: string
  status: 'approved' | 'declined'
  comments?: string
}

export interface InviteEducatorRequest {
  email: string
  firstName: string
  lastName: string
  message?: string
}

export interface RegisterEducatorRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  expertise: string[]
  experience: number
  bio: string
  cv: File | string
  introVideo?: File | string
  inviteToken?: string
}

export interface CourseMetaDataRequest {
  courseId: string
  tags: string[]
  objectives: string[]
  requirements: string[]
  targetAudience: string[]
}

export interface AddChapterRequest {
  courseId: string
  title: string
  description: string
  order?: number
}

export interface AddLessonRequest {
  courseId: string
  chapterId: string
  title: string
  description: string
  videoFile?: File
  resourceFile?: File
  duration?: string
  order?: number
  isFree?: boolean
}

export interface UpdateChapterRequest extends AddChapterRequest {
  chapterId: string
}

export interface UpdateLessonRequest extends AddLessonRequest {
  lessonId: string
}

export interface SortItemsRequest {
  courseId: string
  chapterId?: string
  items: Array<{ id: string; order: number }>
}

export interface WebinarRequest {
  title: string
  description: string
  thumbnail?: File | string
  startTime: string
  endTime: string
  price: number
  currency: string
  maxParticipants: number
  zoomMeetingId?: string
  resources?: File[] | string[]
}

export interface UpdateWebinarRequest extends WebinarRequest {
  webinarId: string
}

// Payment Types
export interface PaymentHistory {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'success' | 'pending' | 'failed'
  paymentMethod: string
  description: string
  itemType: 'course' | 'webinar' | 'subscription'
  itemId: string
  createdAt: string
}

export interface PaymentParams extends PaginationParams {
  userId?: string
  status?: string
  startDate?: string
  endDate?: string
  itemType?: string
}

// Upload Types
export interface UploadUrlRequest {
  fileName: string
  fileType: string
  fileSize: number
  uploadType: 'video' | 'resource' | 'thumbnail' | 'cv'
}

export interface UploadUrlResponse {
  uploadUrl: string
  fileKey: string
  expiresIn: number
}

export interface UploadSuccessRequest {
  fileKey: string
  uploadType: string
  entityId: string
  entityType: 'course' | 'lesson' | 'webinar' | 'educator'
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  icon?: string
  courseCount: number
}

// Coupon Types
export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  validFrom: string
  validUntil: string
  usageLimit: number
  usedCount: number
  applicableItems: string[]
  minPurchaseAmount?: number
}

export interface CouponParams {
  code?: string
  isActive?: boolean
}

export interface DiscountPriceParams {
  itemId: string
  itemType: 'course' | 'webinar' | 'subscription'
  couponCode: string
}

// Activity Types
export interface UserActivity {
  activityType: string
  entityId: string
  entityType: string
  metadata?: Record<string, unknown>
}

// Language Types
export interface LanguageUpdateRequest {
  language: string
  userId?: string
}
