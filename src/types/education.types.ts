/**
 * ============================================
 * EDUCATION MODULE TYPE DEFINITIONS
 * ============================================
 *
 * This file contains all TypeScript interfaces and types for the education module.
 * It includes types for courses, webinars, tutors, payments, and their related API operations.
 *
 * Structure:
 * 1. Core Entity Types (Courses, Chapters, Lessons, etc.)
 * 2. User & Educator Types
 * 3. Webinar Types
 * 4. Payment & Invoice Types
 * 5. Form & Component Types
 * 6. API Request/Response Types
 * 7. Query Parameter Types
 */

// ============================================
// 1. CORE EDUCATION ENTITY TYPES
// ============================================

/**
 * Main course data interface representing a complete course entity
 * Used across the application for course display, management, and API responses
 */
export interface CourseData {
  _id: string

  title: string
  description: string
  thumbNail?: string
  price: number
  currency: string
  duration: string

  category: string
  categories?: string[]
  level?: 'beginner' | 'intermediate' | 'advanced'
  subtitle?: string
  status?: string
  slugUrl?: string

  instructor?: InstructorInfo
  educatorId?: InstructorInfo

  chapters?: ChapterData[]
  totalChaptersCount?: number
  totalLessonsCount?: number
  totalDurationOfCourse?: string

  isPublished?: boolean
  isEnrolled?: boolean
  isCourseBought?: boolean
  enrollmentCount?: number
  rating?: number
  progress?: number

  isPaid?: boolean
  isFree?: boolean

  previewVideo?: { fileName?: string } | string
}

/**
 * Chapter data representing a section within a course
 * Contains lessons and metadata about course progression
 */
export interface ChapterData {
  _id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: string

  // Chapter content
  lessons?: LessonData[]
  lessonList?: LessonData[] // Legacy field name

  // Chapter status
  isPublished?: boolean
  isCompleted?: boolean

  // Chapter metadata
  totalLessons?: number
  totalDuration?: string
}

/**
 * Individual lesson data within a chapter
 * Represents the smallest unit of course content
 */
export interface LessonData {
  _id?: string
  chapterId: string
  title: string
  description?: string
  duration?: string
  order: number

  // Lesson content & access
  isPublished?: boolean
  videoUrl?: string
  resourceUrls?: string[]

  // Additional properties for flexibility
  [key: string]: unknown
}

/**
 * Instructor/Educator information
 * Used to represent course instructors and educator profiles
 */
export interface InstructorInfo {
  // Identifiers (supporting both formats)
  id?: string
  _id?: string

  // Personal information
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  bio?: string
  avatar?: string

  // Professional information
  expertise?: string[]
  rating?: number
  coursesCount?: number
}

/**
 * Category data for course classification
 * Supports both simple string categories and complex category objects
 */
export interface CategoryData {
  _id?: string
  name?: string
  category?: string
  label?: string
  value?: string
}

// ============================================
// 2. USER & EDUCATOR TYPES
// ============================================

/**
 * Complete tutor/educator profile data
 * Contains all information about an educator including qualifications and status
 */
export interface TutorData {
  // Basic identification
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string

  // Profile information
  bio?: string
  profilePicture?: string
  status?: string

  // Professional qualifications
  expertise?: Expertise[]
  education?: Education[]
  certifications?: Certification[]
  experience?: Experience[]

  // Administrative data
  lastLoginAt?: string
  approvedDate?: string
  approvedBy?: ApprovedBy
  declinedDate?: string
  declinedBy?: ApprovedBy
}

/**
 * Expertise area for educators
 * Represents subject matter expertise with optional subcategories
 */
export interface Expertise {
  _id: string
  category: string
  subcategories?: string[]
}

/**
 * Simplified expertise area (legacy support)
 */
export interface ExpertiseArea {
  _id: string
  category: string
}

/**
 * Educational background information
 * Represents formal education credentials
 */
export interface Education {
  _id?: string
  degree?: string
  field?: string
  institution?: string
  year?: string | number
  startYear?: string | number
  endYear?: string | number
}

/**
 * Professional certification information
 * Represents professional certifications and credentials
 */
export interface Certification {
  _id?: string
  name?: string
  title?: string
  degree?: string
  organization?: string
  issueDate?: string
  year?: string | number
  credentialId?: string
  credentialUrl?: string
}

/**
 * Work experience information
 * Represents professional work history
 */
export interface Experience {
  _id?: string
  title?: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
  current?: boolean
}

/**
 * Administrative approval information
 * Tracks who approved/declined educator applications
 */
export interface ApprovedBy {
  _id?: string
  name?: string
  email?: string
  role?: string
}

// ============================================
// 3. WEBINAR TYPES
// ============================================

/**
 * Complete webinar data interface
 * Represents live or recorded webinar sessions
 */
export interface WebinarData extends Record<string, unknown> {
  // Core identifiers
  _id: string

  // Basic webinar information
  title: string
  description: string
  thumbnail: string
  thumbNail?: string // Legacy field
  subtitle?: string

  // Scheduling information
  startTime: string
  endTime: string
  duration: number
  scheduledDate?: string

  // Pricing & access
  price?: number
  currency?: string
  isPaid?: boolean

  // Instructor information
  instructor?: InstructorInfo

  // Participant management
  maxParticipants?: number
  maxAttendees?: number
  currentParticipants?: number
  totalEnrolled?: number

  // Technical integration
  zoomMeetingId?: string
  location?: string

  // Status management
  status:
    | 'scheduled'
    | 'live'
    | 'completed'
    | 'cancelled'
    | 'published'
    | 'draft'
  isPublished?: boolean
  isEnrolled?: boolean
  isWebinarBought?: boolean

  // Content & resources
  resources?: WebinarResource[]
  keyTakeaways?: string[]
  category?: string[]

  // Metadata
  createdAt?: string

  // Webinar scheduling object for join functionality
  webinarScheduledObj?: {
    can_join?: boolean
    join_date?: string
    [key: string]: unknown
  }
}

/**
 * Webinar resource file information
 * Represents downloadable resources associated with webinars
 */
export interface WebinarResource {
  _id?: string
  name: string
  type: string
  url: string
  size?: number
}

/**
 * Webinar attachment file structure
 * Used for file uploads and downloads
 */
export interface AttachmentFile {
  url: string
  file: string
  name?: string
}

// ============================================
// 4. PAYMENT & INVOICE TYPES
// ============================================

/**
 * Payment transaction data
 * Represents completed or pending payments for courses/webinars
 */
export interface PaymentData {
  _id: string
  transactionId: string
  amount: number
  currency?: string
  status?: string
  createdAt: string
  userId?: string
  moduleType: 'webinar' | 'course'

  // Associated course information
  courseId?: {
    _id: string
    title: string
    thumbnail?: string
    thumbNail?: string
    [key: string]: unknown
  }

  // Associated webinar information
  webinarId?: {
    _id: string
    title: string
    thumbnail?: string
    thumbNail?: string
    [key: string]: unknown
  }

  [key: string]: unknown
}

/**
 * Invoice data structure
 * Contains invoice items and pagination info
 */
export interface InvoiceData {
  data: InvoiceItem[]
  totalPages?: number
  count?: number
  [key: string]: unknown
}

/**
 * Individual invoice item
 * Represents a single line item in an invoice
 */
export interface InvoiceItem {
  _id: string
  amount: number
  createdAt: string
  moduleType: string
  userId: InvoiceUser
  educatorId: InvoiceUser
  transactionId?: string
  status?: string
}

/**
 * User information in invoice context
 * Simplified user data for invoice generation
 */
export interface InvoiceUser {
  _id?: string
  email?: string
  firstName?: string
  lastName?: string
}

// ============================================
// 5. FORM & COMPONENT TYPES
// ============================================

/**
 * Course creation/editing form data
 * Used in course management forms
 */
export interface CourseFormData {
  title: string
  description: string
  price?: number
  category?: string
  level?: string
  thumbnail?: File | string
  previewVideo?: File | string
  isFree?: boolean
  isPaid?: boolean
  subtitle?: string
}

/**
 * Extended course creation form data
 * Includes additional fields for course creation workflow
 */
export interface CreateCourseFormData extends Omit<CourseFormData, 'category'> {
  isPaid?: boolean
  subtitle?: string
  category?: string | string[]
  image?: File | string
  video?: File | string
  [key: string]: string | number | boolean | File | string[] | null | undefined
}

/**
 * Chapter creation/editing form data
 */
export interface ChapterFormData {
  title: string
  description?: string
  order?: number
}

/**
 * Lesson creation/editing form data
 * Used in lesson management forms
 */
export interface LessonFormData {
  title: string
  description?: string
  videoUrl?: string
  resourceUrl?: string
  duration?: string
  lessonType?: string
  isFree?: boolean
  chapterTitle?: string
  lessonTitle?: string
  resource?: string | File
}

/**
 * Default values for lesson forms
 */
export interface DefaultValues {
  isFree: boolean
  lessonTitle: string
  resource: string
}

/**
 * Webinar creation/editing form data
 * Used in webinar management forms
 */
export interface WebinarFormData {
  title: string
  description: string
  category?: string[]
  scheduleType: string
  isPaid?: boolean
  price?: number | null
  image?: File | string
  resources?: { file: File | string; id?: string }[]
  startDate?: Date
  startTime?: Date | null
  endTime?: Date | null
  days?: {
    day: string
    selected?: boolean
    startTime?: Date | null
    endTime?: Date | null
  }[]
  [key: string]: unknown
}

/**
 * Props for webinar creation component
 */
export interface CreateWebinarProps {
  isEdit?: boolean
  isPreview?: boolean
  isPublished?: boolean
  savedDetails?: Partial<WebinarFormData>
  defaultValues?: Partial<WebinarFormData>
}

/**
 * Modal box handle interface for component refs
 */
export interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

/**
 * Props for lesson addition components
 */
export interface AddLessonProps {
  chapterId?: string
  courseId?: string
  isEdit?: boolean
  isChapter?: boolean
  defaultValues?: Partial<LessonFormData> & DefaultValues
  lessonId?: string
  handleClose: () => void
  onClose?: () => void
}

/**
 * Extended tutor props for component usage
 */
export type TutorProps = TutorData & {
  [key: string]: unknown
}

/**
 * Props for delete confirmation modals
 */
export interface DeleteModalProps {
  handleDelete: () => void | Promise<void>
  message: string
  isDisabled?: boolean
  forceOpen?: boolean
  onClose?: () => void
}

/**
 * File change handler type for upload components
 */
export interface FileChangeHandler {
  (
    event: React.ChangeEvent<HTMLInputElement>,
    setErrors: (
      errors:
        | import('../types/common').FileError
        | ((
            prev: import('../types/common').FileError,
          ) => import('../types/common').FileError),
    ) => void,
    setResource: (resource: File | null) => void,
  ): void
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

/**
 * Upload prompt handle for abort controllers
 */
export interface UploadPromptHandle {
  current: AbortController | null
}

// ============================================
// 6. API RESPONSE TYPES
// ============================================

/**
 * Generic paginated response structure
 * Used for list APIs with pagination
 */
interface PaginatedApiResponse<T> {
  data: T[]
  totalPages?: number
  count?: number
  currentPage?: number
  totalCount?: number
  [key: string]: unknown
}

/**
 * Course API responses
 */
export interface CourseApiResponse extends PaginatedApiResponse<CourseData> {}

export interface TutorApiResponse extends PaginatedApiResponse<TutorData> {}

export interface PaymentHistoryResponse
  extends PaginatedApiResponse<PaymentData> {}

export interface LessonsResponse extends PaginatedApiResponse<LessonData> {}

/**
 * Webinar attachments API response
 */
export interface WebinarAttachmentsResponse {
  data: AttachmentFile[]
  message?: string
  success?: boolean
}

/**
 * Course count statistics response
 */
export interface CourseCountResponse {
  data: {
    courseCount: number
    publishedCourseCount: number
    draftCourseCount: number
  }
}

/**
 * Webinar count statistics response
 */
export interface WebinarCountResponse {
  data: {
    webinarCount: number
    publishedWebinarCount: number
    draftWebinarCount: number
  }
}

/**
 * Tutor details with extended information
 */
export interface TutorDetailsResponse {
  data: {
    tutorDetails: TutorData & {
      company?: string
      experience?: number
      hau?: string
      education?: Education[]
      certifications?: Certification[]
    }
    courses?: CourseItem[]
    webinars?: WebinarItem[]
    achievements?: Achievement[]
    [key: string]: unknown
  }
  tutor?: TutorData
  success?: boolean
  message?: string
}

/**
 * Simplified course item for listings
 */
export interface CourseItem {
  _id?: string
  id?: string
  title?: string
  description?: string
  thumbnail?: string
  category?: string[]
  price?: number
  [key: string]: unknown
}

/**
 * Simplified webinar item for listings
 */
export interface WebinarItem {
  _id?: string
  id?: string
  title?: string
  description?: string
  thumbnail?: string
  startTime?: string
  endTime?: string
  price?: number
  [key: string]: unknown
}

/**
 * Achievement data structure
 */
export interface Achievement {
  _id?: string
  id?: string
  title?: string
  description?: string
  date?: string
  [key: string]: unknown
}

/**
 * Extended course details type
 */
export type CourseDetail = CourseData & {
  [key: string]: unknown
}

// ============================================
// 7. QUERY PARAMETER TYPES
// ============================================

/**
 * Parameters for getAllCourses API query
 * Supports filtering, sorting, and pagination
 */
export interface GetAllCoursesParams {
  // Pagination
  page?: number
  pageSize?: number
  limit?: number

  // Search & filtering
  search?: string
  category?: string | string[]
  level?: 'beginner' | 'intermediate' | 'advanced'
  status?: 'published' | 'draft' | 'all'

  // Sorting
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating' | 'enrollmentCount'
  order?: 'asc' | 'desc'

  // Price filtering
  minPrice?: number
  maxPrice?: number
  isFree?: boolean

  // Additional filters
  educatorId?: string
  featured?: boolean

  [key: string]: unknown
}

/**
 * Response structure for getAllCourses API
 * Matches the actual API response format
 */
export interface GetAllCoursesResponse {
  data: {
    courses: CourseData[]
    count: number
  }
  message: string
}

/**
 * Legacy courses response interface
 * Kept for backwards compatibility
 */
export interface CoursesResponse {
  data: {
    courses: CourseData[]
    count: number
  }
  message: string
}

/**
 * Parameters for getAllWebinars API query
 * Supports filtering, sorting, and pagination for webinars
 */
export interface GetAllWebinarsParams {
  // Pagination
  page?: number
  pageSize?: number
  limit?: number

  // Search & filtering
  search?: string
  category?: string | string[]
  status?:
    | 'scheduled'
    | 'live'
    | 'completed'
    | 'cancelled'
    | 'published'
    | 'draft'

  // Sorting
  sortBy?: 'title' | 'price' | 'startTime' | 'endTime' | 'totalEnrolled'
  order?: 'asc' | 'desc'

  // Date filtering
  startDate?: string
  endDate?: string

  // Additional filters
  educatorId?: string
  isPurchased?: boolean
  categories?: string

  [key: string]: unknown
}

/**
 * Response structure for getAllWebinars API
 * Matches the actual API response format
 */
export interface GetAllWebinarsResponse {
  data: {
    webinars: WebinarData[]
    count: number
  }
  message: string
}

// ============================================
// 8. EDUCATOR MANAGEMENT TYPES
// ============================================

/**
 * Parameters for educator application queries
 */
export interface EducatorApplicationParams {
  page?: number
  pageSize?: number
  status?: 'pending' | 'approved' | 'declined' | 'reconsidering'
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

/**
 * Response for educator applications list
 */
export interface EducatorApplicationsResponse {
  data: TutorData[]
  totalPages: number
  count: number
  currentPage: number
  totalCount: number
}

/**
 * Parameters for approved educators query
 */
export interface ApprovedEducatorParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

/**
 * Response for approved educators list
 */
export interface ApprovedEducatorsResponse {
  data: TutorData[]
  totalPages: number
  count: number
  currentPage: number
  totalCount: number
}

/**
 * Request for approving/declining educators
 */
export interface ApproveEducatorRequest {
  educatorId: string
  status: 'approved' | 'declined'
  comments?: string
  approvedBy?: string
}

/**
 * Request for inviting new educators
 */
export interface InviteEducatorRequest {
  email: string
  firstName: string
  lastName: string
  message?: string
  expertise?: string[]
}

/**
 * Request for resending educator invitations
 */
export interface ResendInvitationRequest {
  educatorId: string
  email: string
}

/**
 * Request for reconsidering educator status
 */
export interface ReconsiderStatusRequest {
  educatorId: string
  comments?: string
}

/**
 * Request for updating educator details
 */
export interface UpdateEducatorDetailsRequest {
  educatorId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bio?: string
  expertise?: Expertise[]
  education?: Education[]
  certifications?: Certification[]
  experience?: Experience[]
}

/**
 * Request for deleting educators
 */
export interface DeleteEducatorRequest {
  educatorId: string
}

// ============================================
// 9. EDUCATOR AUTHENTICATION TYPES
// ============================================

/**
 * Educator registration request
 */
export interface RegisterEducatorRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  expertise: string[]
  bio?: string
  inviteToken?: string
}

/**
 * Educator forgot password request
 */
export interface EducatorForgotPasswordRequest {
  email: string
}

/**
 * Educator reset password request
 */
export interface EducatorResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

/**
 * Educator logout request
 */
export interface EducatorLogoutRequest {
  token?: string
}

/**
 * Educator login request
 */
export interface EducatorLoginRequest {
  email: string
  password: string
}

/**
 * Educator login response
 */
export interface EducatorLoginResponse {
  token: string
  educator: TutorData
  message: string
}

/**
 * Educator authentication response
 */
export interface EducatorAuthResponse {
  data: {
    educator: TutorData
    isAuthenticated: boolean
  }
}

// ============================================
// 10. COURSE MANAGEMENT TYPES
// ============================================

/**
 * Request for creating new courses
 */
export interface CreateCourseRequest {
  title: string
  description: string
  category: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  isPaid: boolean
  thumbnail?: string
  previewVideo?: string
}

/**
 * Response for course creation
 */
export interface CreateCourseResponse {
  data: {
    courseId: string
    course: CourseData
    message: string
  }
}

/**
 * Request for course metadata updates
 */
export interface CourseMetaDataRequest {
  courseId: string
  tags?: string[]
  objectives?: string[]
  requirements?: string[]
  targetAudience?: string[]
  language?: string
}

/**
 * Request for adding chapters to courses
 */
export interface AddChapterRequest {
  courseId: string
  title: string
  description?: string
  order?: number
}

/**
 * Response for chapter addition
 */
export interface AddChapterResponse {
  data: {
    chapterId: string
    chapter: ChapterData
    message: string
  }
}

/**
 * Request for adding lessons to chapters
 */
export interface AddLessonRequest {
  courseId: string
  chapterId: string
  title: string
  description?: string
  lessonType: 'video' | 'text' | 'quiz' | 'assignment'
  duration?: string
  order?: number
  isFree?: boolean
  videoUrl?: string
  resourceUrl?: string
}

/**
 * Response for lesson addition
 */
export interface AddLessonResponse {
  data: {
    lessonId: string
    lesson: LessonData
    message: string
  }
}

/**
 * Request for updating chapters
 */
export interface UpdateChapterRequest {
  courseId: string
  chapterId: string
  title?: string
  description?: string
  order?: number
  isPublished?: boolean
}

/**
 * Request for updating lessons
 */
export interface UpdateLessonRequest {
  courseId: string
  chapterId: string
  lessonId: string
  title?: string
  description?: string
  lessonType?: string
  duration?: string
  order?: number
  isFree?: boolean
  videoUrl?: string
  resourceUrl?: string
}

/**
 * Request for updating courses
 */
export interface UpdateCourseRequest {
  courseId: string
  title?: string
  description?: string
  category?: string[]
  level?: string
  price?: number
  isPaid?: boolean
  thumbnail?: string
  previewVideo?: string
  isPublished?: boolean
}

/**
 * Request for sorting chapters within a course
 */
export interface SortChaptersRequest {
  courseId: string
  chapters: Array<{
    chapterId: string
    order: number
  }>
}

/**
 * Request for sorting lessons within a chapter
 */
export interface SortLessonsRequest {
  courseId: string
  chapterId: string
  lessons: Array<{
    lessonId: string
    order: number
  }>
}

/**
 * Parameters for course preview
 */
export interface CoursePreviewParams {
  courseId: string
}

/**
 * Response for course preview with extended data
 */
export interface CoursePreviewResponse {
  data: CourseData
}

// ============================================
// 11. UPLOAD & RESOURCE TYPES
// ============================================

/**
 * Request for getting upload URLs
 */
export interface GetUploadUrlRequest {
  fileName: string
  fileType: string
  fileSize: number
  uploadType: 'video' | 'resource' | 'thumbnail' | 'preview'
  courseId?: string
  chapterId?: string
  lessonId?: string
}

/**
 * Response for upload URL generation
 */
export interface GetUploadUrlResponse {
  data: {
    uploadUrl: string
    fileKey: string
    expiresIn: number
  }
}

/**
 * Request for confirming successful video uploads
 */
export interface VideoUploadSuccessRequest {
  fileKey: string
  courseId?: string
  chapterId?: string
  lessonId?: string
  uploadType: string
}

/**
 * Request for downloading resources
 */
export interface DownloadResourceRequest {
  resourceKey: string
  lessonId?: string
}

/**
 * Response for resource download URLs
 */
export interface DownloadResourceResponse {
  data: {
    downloadUrl: string
    fileName: string
    expiresIn: number
  }
}

// ============================================
// 12. WEBINAR MANAGEMENT TYPES
// ============================================

/**
 * Parameters for getting webinars list
 */
export interface GetWebinarsParams {
  page?: number
  pageSize?: number
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
  educatorId?: string
  search?: string
  startDate?: string
  endDate?: string
}

/**
 * Response for webinars list
 */
export interface GetWebinarsResponse {
  data: WebinarData[]
  totalPages: number
  count: number
  currentPage: number
  totalCount: number
}

/**
 * Request for creating webinars
 */
export interface CreateWebinarRequest {
  title: string
  description: string
  category: string[]
  startTime: string
  endTime: string
  maxAttendees: number
  price?: number
  isPaid: boolean
  thumbnail?: string
  resources?: string[]
  zoomMeetingId?: string
}

/**
 * Response for webinar creation
 */
export interface CreateWebinarResponse {
  data: {
    webinarId: string
    webinar: WebinarData
    message: string
  }
}

/**
 * Request for updating webinars
 */
export interface UpdateWebinarRequest {
  webinarId: string
  title?: string
  description?: string
  category?: string[]
  startTime?: string
  endTime?: string
  maxAttendees?: number
  price?: number
  isPaid?: boolean
  thumbnail?: string
  resources?: string[]
  status?: string
}

/**
 * Parameters for webinar details
 */
export interface WebinarDetailParams {
  webinarId: string
}

/**
 * Response for webinar details with attendees
 */
export interface WebinarDetailResponse {
  data: WebinarData & {
    attendees: Array<{
      userId: string
      name: string
      email: string
      joinedAt: string
    }>
    resources: WebinarResource[]
  }
}

/**
 * Parameters for past webinars query
 */
export interface PastWebinarsParams {
  educatorId?: string
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

/**
 * Response for past webinars
 */
export interface PastWebinarsResponse {
  data: WebinarData[]
  totalPages: number
  count: number
}

/**
 * Request for displaying webinar schedule time
 */
export interface DisplayScheduleTimeRequest {
  webinarId: string
  timezone?: string
}

/**
 * Response for webinar schedule time display
 */
export interface DisplayScheduleTimeResponse {
  data: {
    displayTime: string
    localTime: string
    timezone: string
    join_date?: string
  }
}

/**
 * Parameters for email verification
 */
export interface VerifyEmailParams {
  email: string
}

/**
 * Response for email verification
 */
export interface VerifyEmailResponse {
  data: {
    exists: boolean
    message: string
  }
}

// ============================================
// 13. CATEGORY & LANGUAGE TYPES
// ============================================

/**
 * Response for category list
 */
export interface CategoryListResponse {
  data: Array<{
    _id: string
    name: string
    slug: string
    icon?: string
    subcategories?: string[]
  }>
}

/**
 * Request for language change
 */
export interface LanguageChangeRequest {
  language: string
  educatorId?: string
}

// ============================================
// 14. INVOICE & PAYMENT MANAGEMENT TYPES
// ============================================

/**
 * Parameters for invoice generation
 */
export interface GenerateInvoiceParams {
  transactionId: string
  format?: 'pdf' | 'html'
}

/**
 * Response for invoice generation
 */
export interface GenerateInvoiceResponse {
  data: {
    invoiceUrl: string
    invoiceNumber: string
    amount: number
    currency: string
  }
}

/**
 * Parameters for admin invoice queries
 */
export interface AdminInvoiceParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  status?: string
  educatorId?: string
}

/**
 * Response for admin invoice data
 */
export interface AdminInvoiceResponse {
  data: Array<{
    _id: string
    transactionId: string
    amount: number
    currency: string
    status: string
    educatorId: string
    courseId?: string
    webinarId?: string
    createdAt: string
  }>
  totalPages: number
  count: number
  totalAmount: number
}

/**
 * Parameters for downloading admin invoices
 */
export interface DownloadAdminInvoiceParams {
  invoiceId: string
  format?: 'pdf' | 'csv' | 'excel'
}

/**
 * Response for admin invoice downloads
 */
export interface DownloadAdminInvoiceResponse {
  data: {
    url: string
    fileName: string
    format: string
  }
}

// ============================================
// 15. EDUCATOR PROFILE TYPES
// ============================================

/**
 * Parameters for educator profile queries
 */
export interface EducatorProfileParams {
  educatorId: string
}

/**
 * Response for educator profile with aggregated data
 */
export interface EducatorProfileResponse {
  data: {
    educator: TutorData
    courses: CourseData[]
    webinars: WebinarData[]
    totalStudents: number
    totalRevenue: number
    rating: number
  }
}

/**
 * Parameters for educator courses query
 */
export interface EducatorCoursesParams {
  educatorId: string
  page?: number
  pageSize?: number
  status?: 'published' | 'draft'
}

/**
 * Response for educator courses with revenue data
 */
export interface EducatorCoursesResponse {
  data: CourseData[]
  totalPages: number
  count: number
  totalRevenue: number
}
