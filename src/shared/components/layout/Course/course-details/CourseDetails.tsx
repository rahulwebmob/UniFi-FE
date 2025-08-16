import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// import { useTranslation } from 'react-i18next' // Uncomment when translations are needed

import ApiResponseWrapper from '../../../api-middleware'
import PremiumModal from '../../premium/premium-modal/PremiumModal'
import { useGetParticularCourseQuery } from '../../../../../Services/education'
import ContentView from '../../../../../roles/educator-user/components/courses/content-view'

const getPurchaseDetails = (item, purchaseType = 'COURSE') => {
  const subscriptionDetail = {
    features: [],
    duration: '',
    key: item?._id,
    _id: item?._id,
    name: item?.title,
    price: item?.price,
    purchaseType,
    displayName: item?.title,
    description: item?.subtitle,
  }

  if (purchaseType === 'WEBINAR' && item?.webinarScheduledObj?.join_date) {
    subscriptionDetail.scheduledDate = item.webinarScheduledObj.join_date
  }

  return {
    mediaDetails: {
      logo: item?.thumbNail,
      coverImage: item?.thumbNail,
      featureImage: item?.thumbNail,
      educatorDetails: item?.educatorId,
    },
    subscriptionDetails: [subscriptionDetail],
  }
}

const CourseDetails = () => {
  const { id } = useParams()
  const subscriptionRef = useRef()
  // const { t } = useTranslation('education') // Uncomment when translations are needed

  const { data, isLoading, error } = useGetParticularCourseQuery(
    { courseId: id },
    { skip: !id },
  )
  const courseData = data?.data

  const premiumModelDetails = useMemo(
    () => getPurchaseDetails(courseData),
    [courseData],
  )

  const handleOpenPremiumModal = () => {
    subscriptionRef.current.openModal()
  }

  return (
    <ApiResponseWrapper
      error={error}
      isLoading={isLoading}
      isData={!!data?.data}
    >
      <ContentView
        isEdit={false}
        courseData={courseData}
        handleOpenPremiumModal={handleOpenPremiumModal}
      />
      <PremiumModal
        ref={subscriptionRef}
        subscriptionDetails={premiumModelDetails?.subscriptionDetails}
        mediaDetails={premiumModelDetails?.mediaDetails}
        isEducation
      />
    </ApiResponseWrapper>
  )
}

export default CourseDetails
