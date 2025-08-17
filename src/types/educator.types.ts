// Educator Types

export interface Expertise {
  _id: string
  category: string
}

export interface ProfileUrl {
  link: string
}

export interface TutorDetails {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: Expertise[]
  experience: number
  bio: string
  cv?: string
  introVideo?: string
  status: 'pending' | 'approved' | 'declined' | 'reconsidering'
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
  otherProfileUrls?: ProfileUrl[]
}

export interface CourseData {
  _id: string
  title: string
  description: string
  thumbnail: string
  price: number
  currency: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  chapters: ChapterData[]
  enrollmentCount: number
  rating: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  // Additional properties for content-view
  previewVideo?: string
  isPaid?: boolean
  isCourseBought?: boolean
  totalChaptersCount?: number
  totalLessonsCount?: number
  totalDurationOfCourse?: number
  educatorId?: {
    firstName?: string
    lastName?: string
    _id?: string
  }
  categories?: CategoryData[]
}

export interface ChapterData {
  _id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: string
  lessons: LessonData[]
  isPublished: boolean
  isCompleted?: boolean
  // Additional properties for content-view
  lessonList?: LessonData[]
  totalLessons?: number
  totalDuration?: number
}

export interface LessonData {
  _id: string
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
  // Additional properties for content-view
  lessonType?: string
  durationInSeconds?: number
  isCourseBought?: boolean
}

export interface CreateCourseProps {
  courseData?: CourseData
  isEdit: boolean
  handleOpenPremiumModal?: () => void
}

export interface AddLessonProps {
  isEdit: boolean
  lessonId?: string
  courseId: string
  isChapter: boolean
  chapterId?: string
  handleClose: () => void
  refetchLessons?: () => void
}

export interface CategoryData {
  _id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  icon?: string
  courseCount: number
}

// Helper function to format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// Video format types
export const VIDEO_FORMATS = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  webm: 'video/webm',
} as const

export type VideoFormat = keyof typeof VIDEO_FORMATS

export function getVideoMimeType(extension: string): string {
  const ext = extension.toLowerCase().replace('.', '') as VideoFormat
  return VIDEO_FORMATS[ext] || 'video/mp4'
}
