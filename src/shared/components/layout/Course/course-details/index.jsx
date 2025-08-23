import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import ContentView from '../../../../../roles/educator/components/courses/course-content'
import { useGetParticularCourseQuery } from '../../../../../services/education'
import ApiResponseWrapper from '../../../api-middleware'
import PremiumModal from '../../premium'

const CourseDetails = () => {
  const { id } = useParams()
  const subscriptionRef = useRef(null)

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
            purchaseType: 'COURSE',
          }
        : null,
    [courseData],
  )

  const handlePurchase = () => {
    subscriptionRef.current?.openModal()
  }

  return (
    <ApiResponseWrapper error={error} isLoading={isLoading} isData={!!data?.data}>
      {courseData && (
        <ContentView isEdit={false} courseData={courseData} handlePurchase={handlePurchase} />
      )}
      {!!purchaseDetails && (
        <PremiumModal ref={subscriptionRef} purchaseDetails={purchaseDetails} />
      )}
    </ApiResponseWrapper>
  )
}

export default CourseDetails
