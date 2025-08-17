// Admin Types

export interface ApprovedTutorResponse {
  data: TutorData[]
  total: number
  page: number
  limit: number
  totalPages: number
  [key: string]: unknown // Add index signature for compatibility
}

export interface TutorData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country?: string
  state?: string
  summary?: string
  expertise: Array<{ _id: string; category: string }>
  experience?: number
  bio?: string
  cv?: string
  introVideo?: string
  status: 'pending' | 'approved' | 'declined' | 'reconsidering'
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
  otherProfileUrls?: Array<{ link: string }>
  totalEarnings?: number
  linkedinUrl?: string
  twitterUrl?: string
  youtubeUrl?: string
  websiteUrl?: string
  company?: string
  hau?: string // Where did you hear about us
  education?: Array<{
    _id: string
    degree: string
    field: string
  }>
  certifications?: Array<{
    _id: string
    name: string
    organization: string
  }>
}

export interface TutorDetailsResponse {
  data: TutorData
  success?: boolean
  message?: string
}

export interface DownloadCVResponse {
  url?: string
  success?: boolean
  message?: string
}

export interface WatchVideoResponse {
  url?: string
  success?: boolean
  message?: string
}

export interface InvoiceData {
  data: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
  [key: string]: unknown // Add index signature for compatibility
}

export interface Invoice {
  _id: string
  userId: string
  userEmail: string
  educatorId: string
  educatorEmail: string
  moduleType: string
  amount: number
  currency: string
  status: string
  createdAt: string
  transactionId: string
}

export interface ProcessedInvoice extends Invoice {
  formattedDate?: string
  formattedAmount?: string
}

// Navigation Types
export interface NavRoute {
  path: string
  label: string
  icon?: React.ReactNode
  component?: React.ComponentType
  children?: NavRoute[]
  isActive?: boolean
  onClick?: () => void
}

// Profile Types
export interface UserProfileData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: string
  isEmailVerified: boolean
  isPremium: boolean
  hasPassword?: boolean
  createdAt: string
  updatedAt: string
}

export interface ChangePasswordFormData {
  currentPassword?: string
  password: string
  confirmPassword: string
}

// Table Types
export interface TableStyles {
  tableContainer?: React.CSSProperties
  tableHeader?: React.CSSProperties
  tableBody?: React.CSSProperties
  tableRow?: React.CSSProperties
  tableCell?: React.CSSProperties
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  error?: boolean
  statusCode?: number
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Request Callback Type
export type RequestCallback = (params: Record<string, unknown>) => {
  unwrap: () => Promise<ApiResponse>
}
