// Education module type definitions

export interface CourseData {
  _id?: string
  title?: string
  description?: string
  thumbNail?: string // deprecated alias for thumbnail
  previewVideo?: string
  isPaid?: boolean
  isCourseBought?: boolean
  price?: string | number
  totalChaptersCount?: number
  totalLessonsCount?: number
  totalDurationOfCourse?: number
  educatorId?: {
    firstName?: string
    lastName?: string
  }
  categories?: CategoryData[] | string[]
  chapters?: ChapterData[]
  [key: string]: unknown
}

export interface CategoryData {
  _id: string
  name: string
  category?: string
  [key: string]: unknown
}

export interface ChapterData {
  _id?: string
  title?: string
  lessons?: LessonData[]
  lessonList?: LessonData[] // alias for lessons
  totalLessons?: number
  totalDuration?: number
  [key: string]: unknown
}

export interface LessonData {
  _id?: string
  title?: string
  lessonType?: string
  durationInSeconds?: number
  isFree?: boolean
  isCourseBought?: boolean
  resourceUrl?: string
  file?: string
  status?: string
  chapterId?: string
  courseId?: string
  [key: string]: unknown
}

export interface Education {
  _id: string
  name: string
  year?: string
  degree?: string
  field?: string
  [key: string]: unknown
}

export interface Certification {
  _id: string
  name: string
  year?: string
  degree?: string
  organization?: string
  [key: string]: unknown
}

export interface CourseDetail {
  _id: string
  name: string
  [key: string]: unknown
}

export interface DefaultValues {
  isFree?: boolean
  lessonTitle?: string
  resource?: string
}

export interface AddLessonProps {
  chapterId?: string
  courseId?: string
  isEdit?: boolean
  defaultValues?: DefaultValues
  lessonId?: string
  isChapter?: boolean
  handleClose: () => void
}

export interface DeleteModalProps {
  handleDelete: () => void
  message: string
  isDisabled?: boolean
  forceOpen?: boolean
  onClose?: () => void
}

export interface ContentViewProps {
  courseData: CourseData
  isEdit?: boolean
  handleOpenPremiumModal?: () => void
}

export interface FormFieldValue {
  field: string
  value: unknown
}

export interface UploadResponse {
  data?: {
    url?: string
    [key: string]: unknown
  }
  error?: boolean
}

export interface LessonFormData {
  chapterTitle?: string
  lessonTitle?: string
  resource?: File | string
  [key: string]: unknown
}

export interface ChapterWithLessons {
  _id: string
  title: string
  lessons: LessonData[]
  [key: string]: unknown
}

export interface CourseMutationResponse {
  error?: boolean
  data?: {
    response?: {
      _id?: string
    }
    [key: string]: unknown
  }
}

export interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}
