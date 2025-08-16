import React from 'react'
import { useFormContext } from 'react-hook-form'

import ContentView from '../content-view'
import { useCoursePreviewQuery } from '../../../../../Services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'

const PreviewCourse = () => {
  const { courseId } = useFormContext()
  const { data, error, isLoading } = useCoursePreviewQuery(
    { courseId },
    {
      skip: !courseId,
    },
  )

  const courseData = data?.data

  return (
    <ApiMiddleware error={error} isLoading={isLoading} isData={!!data?.data}>
      <ContentView courseData={courseData} isEdit={false}  />
    </ApiMiddleware>
  )
}

export default PreviewCourse
