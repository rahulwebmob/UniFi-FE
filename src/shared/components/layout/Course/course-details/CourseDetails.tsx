import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// import { useTranslation } from 'react-i18next' // Uncomment when translations are needed

import ApiResponseWrapper from '../../../api-middleware'
import PremiumModal from '../../premium/premium-modal/PremiumModal'
import { useGetParticularCourseQuery } from '../../../../../Services/education'
import ContentView from '../../../../../roles/educator-user/components/Courses/content-view'

interface CourseData {
  _id: string
  title: string
  subtitle: string
  price: number
  thumbNail: string
  educatorId: string
  webinarScheduledObj?: {
    join_date: string
  }
}

interface PurchaseDetails {
  features: string[]
  duration: string
  key: string
  _id: string
  name: string
  price: number
  purchaseType: string
  displayName: string
  description: string
  scheduledDate?: string
}

interface MediaDetails {
  logo: string
  coverImage: string
  featureImage: string
  educatorDetails: string
}

interface SubscriptionDetails {
  mediaDetails: MediaDetails
  subscriptionDetails: PurchaseDetails[]
}

const getPurchaseDetails = (item: CourseData | undefined, purchaseType = 'COURSE'): SubscriptionDetails => {
  const subscriptionDetail: PurchaseDetails = {
    features: [],
    duration: '',
    key: item?._id ?? '',
    _id: item?._id ?? '',
    name: item?.title ?? '',
    price: item?.price ?? 0,
    purchaseType,
    displayName: item?.title ?? '',
    description: item?.subtitle ?? '',
  }

  if (purchaseType === 'WEBINAR' && item?.webinarScheduledObj?.join_date) {
    subscriptionDetail.scheduledDate = item.webinarScheduledObj.join_date
  }

  return {
    mediaDetails: {
      logo: item?.thumbNail ?? '',
      coverImage: item?.thumbNail ?? '',
      featureImage: item?.thumbNail ?? '',
      educatorDetails: item?.educatorId ?? '',
    },
    subscriptionDetails: [subscriptionDetail],
  }
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const subscriptionRef = useRef<{ openModal: () => void }>(null)
  // const { t } = useTranslation('education') // Uncomment when translations are needed

  const { data, isLoading, error } = useGetParticularCourseQuery(
    { courseId: id ?? '' },
    { skip: !id },
  )
  const courseData = data?.data as CourseData | undefined

  const premiumModelDetails = useMemo(
    () => getPurchaseDetails(courseData),
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
