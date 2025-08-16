import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import CreateCourse from '../create-course'
import { extractFilename } from '../../common/common'
import { useListChapersQuery } from '../../../../../Services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'

const EditCourse = ({ currentStep }) => {
  const location = useLocation()
  const { courseId, isPreview } = location?.state || {}

  const { data, error, isLoading } = useListChapersQuery(
    { courseId },
    { skip: !courseId },
  )

  const defaultValues = useMemo(() => {
    const courseData = data?.data || {}
    return {
      isPaid: courseData.isPaid,
      title: courseData.title || '',
      price: courseData.price || '',
      slugUrl: courseData.slugUrl || '',
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      category: courseData.category || [],
      image: extractFilename(courseData.thumbNail?.fileName),
      video: extractFilename(courseData.previewVideo?.fileName),
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
