import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useCoursePreviewQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import ContentView from '../content-view'

interface FormContextType {
  courseId?: string
  [key: string]: unknown
}

const PreviewCourse: React.FC = () => {
  const { courseId } = useFormContext<FormContextType>()
  const { data, error, isLoading } = useCoursePreviewQuery(
    { courseId: courseId || '' },
    {
      skip: !courseId,
    },
  )

  const courseData = data?.data

  return (
    <ApiMiddleware error={error} isLoading={isLoading} isData={!!data?.data}>
      <ContentView courseData={courseData} />
    </ApiMiddleware>
  )
}

export default PreviewCourse