// Education Module Type Definitions

// Course Related Types
export interface CourseData {
  _id: string
  title: string
  description: string
  thumbnail: string
  thumbNail?: { fileName?: string } | string // legacy field
  price: number
  currency: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  categories?: string[] | CategoryData[]
  instructor?: InstructorInfo
  educatorId?: InstructorInfo
  chapters?: ChapterData[]
  enrollmentCount?: number
  rating?: number
  isPublished?: boolean
  isEnrolled?: boolean
  progress?: number
  isPaid?: boolean
  isCourseBought?: boolean
  previewVideo?: { fileName?: string } | string
  totalChaptersCount?: number
  totalLessonsCount?: number
  totalDurationOfCourse?: string
  isFree?: boolean
  slugUrl?: string
  subtitle?: string
  status?: string
}

export interface ChapterData {
  _id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: string
  lessons?: LessonData[]
  lessonList?: LessonData[] // legacy field
  isPublished?: boolean
  isCompleted?: boolean
  totalLessons?: number
  totalDuration?: string
}

export interface LessonData {
  _id?: string
  chapterId: string
  title: string
  description?: string
  duration?: string
  order: number
  isPublished?: boolean
  videoUrl?: string
  resourceUrls?: string[]
  [key: string]: unknown
}

export interface LessonsResponse {
  data: LessonData[]
  totalPages?: number
  count?: number
  currentPage?: number
  totalCount?: number
  [key: string]: unknown
}

export interface InstructorInfo {
  id?: string
  _id?: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  bio?: string
  avatar?: string
  expertise?: string[]
  rating?: number
  coursesCount?: number
}

export interface CategoryData {
  _id?: string
  name?: string
  category?: string
  label?: string
  value?: string
}

// Tutor/Educator Types
export interface TutorData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status?: string
  expertise?: Expertise[]
  education?: Education[]
  certifications?: Certification[]
  experience?: Experience[]
  bio?: string
  profilePicture?: string
  lastLoginAt?: string
  approvedDate?: string
  approvedBy?: ApprovedBy
  declinedDate?: string
  declinedBy?: ApprovedBy
}

export interface Expertise {
  _id?: string
  category: string
  subcategories?: string[]
}

export interface Education {
  _id?: string
  degree?: string
  field?: string
  institution?: string
  year?: string | number
  startYear?: string | number
  endYear?: string | number
}

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

export interface ApprovedBy {
  _id?: string
  name?: string
  email?: string
  role?: string
}

// API Response Types
export interface TutorApiResponse {
  data: TutorData[]
  totalPages?: number
  count?: number
  currentPage?: number
  totalCount?: number
  [key: string]: unknown
}

export interface TutorDetailsResponse {
  data: TutorData
  tutor?: TutorData
  success?: boolean
  message?: string
}

export interface CourseApiResponse {
  data: CourseData[]
  totalPages?: number
  count?: number
  currentPage?: number
  totalCount?: number
  [key: string]: unknown
}

export interface CourseCountResponse {
  data: {
    courseCount: number
    publishedCourseCount: number
    draftCourseCount: number
  }
}

export interface WebinarCountResponse {
  data: {
    webinarCount: number
    publishedWebinarCount: number
    draftWebinarCount: number
  }
}

export interface CoursesResponse {
  data: {
    courses: CourseData[]
    totalPages?: number
    count?: number
    currentPage?: number
    totalCount?: number
    [key: string]: unknown
  }
}

export interface PaymentHistoryResponse {
  data: PaymentData[]
  totalPages?: number
  count?: number
  currentPage?: number
  totalCount?: number
  [key: string]: unknown
}

export interface PaymentData {
  _id: string
  transactionId: string
  amount: number
  currency: string
  status: string
  createdAt: string
  userId: string
  courseId?: string
  webinarId?: string
  [key: string]: unknown
}

// Webinar Attachment Types
export interface AttachmentFile {
  url: string
  file: string
  name?: string
}

export interface WebinarAttachmentsResponse {
  data: AttachmentFile[]
  message?: string
  success?: boolean
}

export type CourseDetail = CourseData & {
  // Extended course details for specific views
  [key: string]: unknown
}

// Form Types
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

export interface CreateCourseFormData extends Omit<CourseFormData, 'category'> {
  isPaid?: boolean
  subtitle?: string
  category?: string | string[]
  image?: File | string
  video?: File | string
  [key: string]: string | number | boolean | File | string[] | null | undefined
}

export interface ChapterFormData {
  title: string
  description?: string
  order?: number
}

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

export interface DefaultValues {
  isFree: boolean
  lessonTitle: string
  resource: string
}

// Modal and Component Props
export interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

export interface AddLessonProps {
  chapterId?: string
  courseId?: string
  isEdit?: boolean
  isChapter?: boolean
  defaultValues?: Partial<LessonFormData>
  lessonId?: string
  handleClose: () => void
  onClose?: () => void
}

export type TutorProps = TutorData & {
  // Extends TutorData with additional component-specific props
  [key: string]: unknown
}

export interface DeleteModalProps {
  handleDelete: () => void | Promise<void>
  message: string
  isDisabled?: boolean
  forceOpen?: boolean
  onClose?: () => void
}

// Webinar Types
export interface WebinarData extends Record<string, unknown> {
  _id: string
  title: string
  description: string
  thumbnail: string
  thumbNail?: string // legacy field
  startTime: string
  endTime: string
  duration: number
  price?: number
  currency?: string
  instructor?: InstructorInfo
  maxParticipants?: number
  maxAttendees?: number
  currentParticipants?: number
  zoomMeetingId?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'published' | 'draft'
  resources?: WebinarResource[]
  isPublished?: boolean
  isEnrolled?: boolean
  isWebinarBought?: boolean
  isPaid?: boolean
  category?: string[]
  subtitle?: string
  location?: string
  totalEnrolled?: number
  createdAt?: string
  scheduledDate?: string
  keyTakeaways?: string[]
  webinarScheduledObj?: {
    can_join?: boolean
    join_date?: string
    [key: string]: unknown
  }
}

export interface WebinarResource {
  _id?: string
  name: string
  type: string
  url: string
  size?: number
}

// Payment and Invoice Types
export interface InvoiceData {
  data: InvoiceItem[]
  totalPages?: number
  count?: number
  [key: string]: unknown
}

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

export interface InvoiceUser {
  _id?: string
  email?: string
  firstName?: string
  lastName?: string
}

// Upload Progress Types
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadPromptHandle {
  current: AbortController | null
}

// Webinar Form Types
export interface WebinarFormData {
  title: string
  description: string
  category: string[]
  scheduleType: string
  isPaid: boolean
  price?: number | null
  image?: File | string
  resources: { file: File | string; id?: string }[]
  startDate?: Date
  startTime?: Date | undefined
  endTime?: Date | undefined
  days?: {
    day: string
    selected?: boolean
    startTime?: Date | undefined
    endTime?: Date | undefined
  }[]
  [key: string]: unknown
}

export interface CreateWebinarProps {
  isEdit?: boolean
  isPreview?: boolean
  isPublished?: boolean
  savedDetails?: Partial<WebinarFormData>
  defaultValues?: Partial<WebinarFormData>
}

// File Handling Types
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
