import { useFormContext } from 'react-hook-form'

import ContentView from '../content-view'
import { useCoursePreviewQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import type { CourseData } from '../../../../../types/education.types'

interface PreviewCourseProps {
  handleOpenPremiumModal?: () => void
}

const PreviewCourse = ({ handleOpenPremiumModal }: PreviewCourseProps) => {
  const formContext = useFormContext<{ courseId: string }>()
  const courseId = formContext.getValues('courseId')
  const { data, error, isLoading } = useCoursePreviewQuery(
    { courseId },
    {
      skip: !courseId,
    },
  )

  const courseData = data?.data as CourseData

  const defaultHandleOpenPremiumModal = () => {
    // Default implementation - can be overridden by prop
    console.log('Premium modal would open here')
  }

  return (
    <ApiMiddleware error={error} isLoading={isLoading} isData={!!data?.data}>
      <ContentView
        courseData={courseData}
        isEdit={false}
        handleOpenPremiumModal={
          handleOpenPremiumModal || defaultHandleOpenPremiumModal
        }
      />
    </ApiMiddleware>
  )
}

export default PreviewCourse
