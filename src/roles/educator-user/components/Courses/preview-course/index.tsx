import { useFormContext } from 'react-hook-form'

import ContentView from '../content-view'
import { useCoursePreviewQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'

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

  return (
    <ApiMiddleware error={error} isLoading={isLoading} isData={!!data?.data}>
      <ContentView
        courseData={data?.data}
        isEdit={false}
        handleOpenPremiumModal={handleOpenPremiumModal}
      />
    </ApiMiddleware>
  )
}

export default PreviewCourse
