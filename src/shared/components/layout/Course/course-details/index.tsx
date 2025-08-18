import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import PremiumModal from '../../premium'
import ApiResponseWrapper from '../../../api-middleware'
import { useGetParticularCourseQuery } from '../../../../../services/education'
import ContentView from '../../../../../roles/educator-user/components/Courses/content-view'

interface PremiumModalRef {
  openModal: () => void
  closeModal: () => void
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const subscriptionRef = useRef<PremiumModalRef>(null)

  const { data, isLoading, error } = useGetParticularCourseQuery(
    { courseId: id ?? '' },
    { skip: !id },
  )
  const courseData = data?.data

  const purchaseDetails = useMemo(
    () =>
      courseData
        ? {
            _id: courseData._id || '',
            price: courseData.price || 0,
            scheduledDate: undefined,
            thumbNail: courseData.thumbNail,
            title: courseData.title,
            purchaseType: 'COURSE' as const,
          }
        : null,
    [courseData],
  )

  const handleOpenPremiumModal = () => {
    subscriptionRef.current?.openModal()
  }

  return (
    <ApiResponseWrapper
      error={error}
      isLoading={isLoading}
      isData={!!data?.data}
    >
      {courseData && (
        <ContentView
          isEdit={false}
          courseData={courseData}
          handleOpenPremiumModal={handleOpenPremiumModal}
        />
      )}
      {!!purchaseDetails && (
        <PremiumModal ref={subscriptionRef} purchaseDetails={purchaseDetails} />
      )}
    </ApiResponseWrapper>
  )
}

export default CourseDetails
