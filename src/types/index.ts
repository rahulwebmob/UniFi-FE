// Central export file for all types

// API Types
export type {
  // Common Types
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  // Authentication Types
  LoginRequest,
  LoginResponse,
  OAuthLoginRequest,
  SignUpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EmailVerificationParams,
  // User Types
  UserData,
  UserAppearance as ApiUserAppearance,
  UserProfileUpdateRequest,
  // Subscription Types
  SubscriptionDetails,
  BuySubscriptionRequest,
  CancelSubscriptionRequest,
  // Invoice Types
  InvoiceParams,
  Invoice,
  InvoiceItem,
  // Partner Types
  PartnerRequest,
  // Feedback Types
  FeedbackRequest,
  // Zoom Types
  ZoomAuthRequest,
  ZoomMeetingRequest,
  ZoomMeetingSettings,
  ZoomMeeting,
  // Education Types
  Course,
  Chapter,
  Lesson,
  Instructor,
  Webinar,
  WebinarResource,
  CourseParams,
  ChapterParams,
  LessonParams,
  WebinarParams,
  // Educator Types
  EducatorApplication,
  EducatorStatusRequest,
  InviteEducatorRequest,
  RegisterEducatorRequest,
  CourseMetaDataRequest,
  AddChapterRequest,
  AddLessonRequest,
  UpdateChapterRequest,
  UpdateLessonRequest,
  SortItemsRequest,
  WebinarRequest,
  UpdateWebinarRequest,
  // Payment Types
  PaymentHistory,
  PaymentParams,
  // Upload Types
  UploadUrlRequest,
  UploadUrlResponse,
  UploadSuccessRequest,
  // Category Types
  Category,
  // Coupon Types
  Coupon,
  CouponParams,
  DiscountPriceParams,
  // Activity Types
  UserActivity,
  // Language Types
  LanguageUpdateRequest,
} from './api.types'

// Redux Types
export type {
  // User Slice Types
  User,
  UserAppearance,
  UserState,
  SignInPayload,
  UpdateTokenPayload,
  LoggedInPayload,
  // App Slice Types
  Alert,
  Language,
  AppState,
  AlertPayload,
  // Education Slice Types
  EducationState,
  CourseDetails,
  ChapterDetails,
  LessonDetails,
  InstructorInfo,
  WebinarDetails,
  WebinarResourceDetails,
  Certificate,
  CourseProgress,
  SetCurrentCoursePayload,
  SetCurrentWebinarPayload,
  EnrollCoursePayload,
  EnrollWebinarPayload,
  CompleteLessonPayload,
  AddCertificatePayload,
  UpdateProgressPayload,
  // Common Redux Types
  RootState,
  // Notification Types
  NotificationState,
  Notification,
  // Settings Types
  SettingsState,
  // Upload Progress Types
  UploadState,
  UploadItem,
  // Socket Types
  SocketState,
  // Chat Types
  ChatState,
  ChatMessage,
  Conversation,
  TypingIndicator,
  // Advertisement Types
  AdvertisementState,
  Advertisement,
  AdImpression,
} from './redux.types'

// Service Types
export type {
  // RTK Query Lifecycle Types
  QueryLifecycleApi,
  QueryFulfilledAction,
  QueryRejectedAction,
  ApiError,
  QueryLifecyclePromise,
  // OnQueryStarted Types
  OnQueryStartedContext,
  OnQueryStartedHandler,
  OnMutationStartedHandler,
  // Service Configuration Types
  ServiceConfig,
  ErrorResponse,
  // Tag Types
  ApiTag,
  TagDescription,
  // Endpoint Builder Types
  EndpointDefinition,
  // Hook Types
  QueryHookResult,
  MutationHookResult,
  LazyQueryHookResult,
  // Service Utility Function Types
  ServiceUtilityConfig,
  RequestInterceptor,
  ResponseInterceptor,
  // File Upload Types
  UploadConfig,
  UploadProgress,
  // WebSocket Types
  SocketConfig,
  SocketMessage,
  // Cache Utility Types
  CacheConfig,
  CachedEntry,
  // Retry Configuration
  RetryConfig,
  // Polling Configuration
  PollingConfig,
  // Optimistic Update Types
  OptimisticUpdate,
} from './service.types'

// Education Module Types
export type {
  // Course Related Types
  CourseData,
  ChapterData,
  LessonData,
  CategoryData,
  // Tutor/Educator Types
  TutorData,
  Expertise,
  Education,
  Certification,
  Experience,
  ApprovedBy,
  // API Response Types
  TutorApiResponse,
  TutorDetailsResponse,
  CourseApiResponse,
  CourseDetail,
  // Form Types
  CourseFormData,
  CreateCourseFormData,
  ChapterFormData,
  LessonFormData,
  // Modal and Component Props
  ModalBoxHandle,
  AddLessonProps,
  TutorProps,
  DeleteModalProps,
  // Webinar Types
  WebinarData,
  WebinarResource as EducationWebinarResource,
  // Payment and Invoice Types
  InvoiceData,
  InvoiceItem as EducationInvoiceItem,
  InvoiceUser,
  // Upload Progress Types
  UploadProgress as EducationUploadProgress,
  UploadPromptHandle,
  // File Handling Types
  FileChangeHandler,
} from './education.types'

// Common Types
export type {
  FileError,
  EducatorDetail,
  NestedArrayObject,
  UpdatedFieldsResult,
  PdfGenerationRequest,
  PdfGenerationResponse,
  ApiResponse as CommonApiResponse,
  RequestCallback,
  FieldValue,
  DataObject,
} from './common'
