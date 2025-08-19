import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useListChapersQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import { extractFilename } from '../../common/common'
import CreateCourse from '../create-course'

const EditCourse = ({ currentStep = 0 }) => {
  const location = useLocation()
  const { courseId, isPreview } = location?.state || {}

  const { data, error, isLoading } = useListChapersQuery(
    { courseId: courseId || '' },
    { skip: !courseId },
  )

  const defaultValues = useMemo(() => {
    const courseData = data?.data || {}
    return {
      isPaid: courseData.isPaid || true,
      title: courseData.title || '',
      price: courseData.price || null,
      slugUrl: courseData.slugUrl || '',
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      category: courseData.category || [],
      image: extractFilename(courseData.thumbNail?.fileName) || '',
      video: extractFilename(courseData.previewVideo?.fileName) || '',
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
