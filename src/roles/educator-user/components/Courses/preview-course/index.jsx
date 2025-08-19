import { useFormContext } from 'react-hook-form'

import { useCoursePreviewQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import ContentView from '../content-view'

const PreviewCourse = () => {
  const { courseId } = useFormContext()
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

PreviewCourse.propTypes = {}

export default PreviewCourse
