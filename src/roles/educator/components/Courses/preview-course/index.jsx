import { useFormContext } from 'react-hook-form'

import { useCoursePreviewQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import CourseContentDetails from '../course-content'

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
      <CourseContentDetails courseData={courseData} />
    </ApiMiddleware>
  )
}

export default PreviewCourse
