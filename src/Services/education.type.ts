// Education API Types

import type { CourseData, WebinarData, ChapterData, LessonData, PaymentData } from '../types/education.types'

// ============== Course Types ==============
export interface GetAllCoursesRequest {
  page?: number
  searchTerm?: string
  isPurchased?: boolean
  pageSize?: number
  categories?: string
}

export interface GetAllCoursesResponse {
  success?: boolean
  data?: {
    courses: CourseData[]
    count: number
  }
}

export interface GetParticularCourseRequest {
  courseId: string
}

export interface GetParticularCourseResponse {
  success?: boolean
  data?: CourseData & {
    chapters?: ChapterData[]
  }
}

export interface GetChapterDetailsRequest {
  courseId: string
  chapterId: string
  lessonId: string
}

export interface GetChapterDetailsResponse {
  success?: boolean
  data?: {
    url?: string
    resources?: string[]
    lesson?: LessonData
    contentType?: string
  }
}

// ============== Webinar Types ==============
export interface GetAllWebinarsRequest {
  page?: number
  search?: string
  isPurchased?: boolean
  limit?: number
  categories?: string
}

export interface GetAllWebinarsResponse {
  success?: boolean
  data?: {
    webinars: WebinarData[]
    count: number
  }
}

export interface GetParticularWebinarDetailRequest {
  webinarId: string
}

export interface GetParticularWebinarDetailResponse {
  success?: boolean
  data?: WebinarData
}

export interface GetAttachmentsListRequest {
  webinarId: string
}

export interface GetAttachmentsListResponse {
  success?: boolean
  data?: {
    attachments: string[]
    resources: string[]
  }
}

// ============== Payment Types ==============
export interface GetEducationPaymentsRequest {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface GetEducationPaymentsResponse {
  success?: boolean
  data?: {
    data: PaymentData[]
    total?: number
  }
}

export interface GetEducationInvoiceRequest {
  invoiceId: string
}

export interface GetEducationInvoiceResponse {
  success?: boolean
  data?: string
  url?: string
}

// ============== Category Types ==============
export interface GetCategoryListResponse {
  success?: boolean
  data?: string[]
}