import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import CreateCourse from '../create-course'
import { extractFilename } from '../../common/common'
import { useListChapersQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import type { CourseData } from '../../../../../types/education.types'

interface EditCourseProps {
  currentStep?: number
}

const EditCourse = ({ currentStep }: EditCourseProps) => {
  const location = useLocation()
  const { courseId, isPreview } =
    (location?.state as { courseId?: string; isPreview?: boolean }) || {}

  const { data, error, isLoading } = useListChapersQuery(
    { courseId },
    { skip: !courseId },
  )

  const defaultValues = useMemo(() => {
    const courseData = (data?.data as CourseData) || {}
    return {
      isPaid: courseData.isPaid,
      title: courseData.title || '',
      price: courseData.price || '',
      slugUrl: courseData.slugUrl || '',
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      category: courseData.category || [],
      image: extractFilename(typeof courseData.thumbNail === 'object' ? courseData.thumbNail?.fileName : courseData.thumbNail),
      video: extractFilename(typeof courseData.previewVideo === 'object' ? courseData.previewVideo?.fileName : courseData.previewVideo),
    }
  }, [data])

  return (
    <ApiMiddleware error={error} isData={!!data?.data} isLoading={isLoading}>
      <CreateCourse
        isEdit
        courseId={courseId}
        isPreview={isPreview}
        currentStep={currentStep}
        defaultValues={defaultValues}
        isPublished={data?.data?.status === 'published'}
      />
    </ApiMiddleware>
  )
}

export default EditCourse
