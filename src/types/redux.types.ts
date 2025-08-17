// Redux State and Action Types

// Redux State and Action Types - No imports needed here as PayloadAction is used in slices directly

// User Slice Types
export interface User {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  language?: string
  layout?: string[]
  appearance?: UserAppearance
  tourGuide?: boolean
  isEmailVerified?: boolean
  isPremium?: boolean
  isPasswordMissing?: boolean
  [key: string]: string | string[] | UserAppearance | boolean | undefined
}

export interface UserAppearance {
  language?: string
  menuPosition?: string
  theme?: 'light' | 'dark'
}

export interface UserState {
  user: User | null
}

// User Action Payloads
export interface SignInPayload {
  token: string
}

export interface UpdateTokenPayload {
  token: string
}

export interface LoggedInPayload {
  loggedUser: User
}

// App Slice Types
export interface Alert {
  key: string
  title: string
  severity: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export interface Language {
  code: string
  value: string
  label: string
  direction: 'ltr' | 'rtl'
}

export interface AppState {
  alerts: Alert[]
  isLoading: boolean
  language: Language
  isFullscreen: boolean
}

// App Action Payloads
export interface AlertPayload {
  message: string
  title?: string
}

// Education Slice Types
export interface EducationState {
  currentCourse: CourseDetails | null
  currentWebinar: WebinarDetails | null
  enrolledCourses: string[]
  enrolledWebinars: string[]
  completedLessons: string[]
  certificates: Certificate[]
  progress: CourseProgress[]
}

export interface CourseDetails {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  currency: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  instructor: InstructorInfo
  chapters: ChapterDetails[]
  enrollmentCount: number
  rating: number
  isPublished: boolean
  isEnrolled?: boolean
  progress?: number
}

export interface ChapterDetails {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: string
  lessons: LessonDetails[]
  isPublished: boolean
  isCompleted?: boolean
}

export interface LessonDetails {
  id: string
  chapterId: string
  title: string
  description: string
  videoUrl?: string
  resourceUrl?: string
  duration: string
  order: number
  isCompleted?: boolean
  isFree?: boolean
  completedAt?: string
}

export interface InstructorInfo {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
  expertise: string[]
  rating: number
  coursesCount: number
}

export interface WebinarDetails {
  id: string
  title: string
  description: string
  thumbnail: string
  startTime: string
  endTime: string
  duration: number
  price: number
  currency: string
  instructor: InstructorInfo
  maxParticipants: number
  currentParticipants: number
  zoomMeetingId?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  resources: WebinarResourceDetails[]
  isPublished: boolean
  isEnrolled?: boolean
}

export interface WebinarResourceDetails {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface Certificate {
  id: string
  courseId: string
  userId: string
  courseName: string
  issueDate: string
  certificateUrl: string
  verificationCode: string
}

export interface CourseProgress {
  courseId: string
  userId: string
  completedLessons: string[]
  completedChapters: string[]
  overallProgress: number
  lastAccessedAt: string
  startedAt: string
  completedAt?: string
}

// Education Action Payloads
export interface SetCurrentCoursePayload {
  course: CourseDetails
}

export interface SetCurrentWebinarPayload {
  webinar: WebinarDetails
}

export interface EnrollCoursePayload {
  courseId: string
}

export interface EnrollWebinarPayload {
  webinarId: string
}

export interface CompleteLessonPayload {
  lessonId: string
  courseId: string
  chapterId: string
}

export interface AddCertificatePayload {
  certificate: Certificate
}

export interface UpdateProgressPayload {
  courseId: string
  progress: Partial<CourseProgress>
}

// Common Redux Types
export interface RootState {
  user: UserState
  app: AppState
  education: EducationState
}

// Note: RTK Query types are defined in service.types.ts to avoid circular dependencies

// Notification Types
export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
}

// Settings Types
export interface SettingsState {
  theme: 'light' | 'dark' | 'auto'
  sidebarCollapsed: boolean
  notificationsEnabled: boolean
  soundEnabled: boolean
  autoPlayVideos: boolean
  videoQuality: 'auto' | '360p' | '720p' | '1080p'
  downloadQuality: 'low' | 'medium' | 'high'
  language: string
  timezone: string
}

// Upload Progress Types
export interface UploadState {
  uploads: UploadItem[]
  totalProgress: number
}

export interface UploadItem {
  id: string
  fileName: string
  fileSize: number
  uploadedSize: number
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled'
  error?: string
  startTime: string
  endTime?: string
  url?: string
}

// Socket Types
export interface SocketState {
  isConnected: boolean
  connectionId?: string
  reconnectAttempts: number
  lastPing?: string
  rooms: string[]
}

// Chat Types (if using Redux for chat state)
export interface ChatState {
  messages: ChatMessage[]
  activeConversation?: string
  conversations: Conversation[]
  typing: TypingIndicator[]
  unreadCounts: Record<string, number>
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  message: string
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  type: 'text' | 'image' | 'file' | 'system'
  metadata?: Record<string, unknown>
  editedAt?: string
  deletedAt?: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name: string
  avatar?: string
  participants: string[]
  lastMessage?: ChatMessage
  createdAt: string
  updatedAt: string
  unreadCount: number
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  userName: string
}

// Advertisement Types (if needed)
export interface AdvertisementState {
  advertisements: Advertisement[]
  activeAd?: Advertisement
  impressions: AdImpression[]
}

export interface Advertisement {
  id: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  position: 'banner' | 'sidebar' | 'popup' | 'inline'
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  isActive: boolean
}

export interface AdImpression {
  adId: string
  userId: string
  timestamp: string
  duration: number
  clicked: boolean
}
