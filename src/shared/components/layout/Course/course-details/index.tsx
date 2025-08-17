import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import PremiumModal from '../../premium'
import ApiResponseWrapper from '../../../api-middleware'
import { useGetParticularCourseQuery } from '../../../../../services/education'
import ContentView from '../../../../../roles/educator-user/components/Courses/content-view'

// Use local CourseData for component-specific structure
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
  educatorDetails: {
    firstName?: string
    lastName?: string
    [key: string]: unknown
  }
}

interface SubscriptionDetails {
  mediaDetails: MediaDetails
  subscriptionDetails: PurchaseDetails[]
}

const getPurchaseDetails = (
  item: CourseData | undefined,
  purchaseType = 'COURSE',
): SubscriptionDetails => {
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
      educatorDetails: {
        firstName: '',
        lastName: '',
        id: item?.educatorId ?? '',
      },
    },
    subscriptionDetails: [subscriptionDetail],
  }
}

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
      {courseData && (
        <ContentView
          isEdit={false}
          courseData={courseData as unknown as import('../../../../../types/education').CourseData}
          handleOpenPremiumModal={handleOpenPremiumModal}
        />
      )}
      <PremiumModal
        ref={subscriptionRef}
        subscriptionDetails={premiumModelDetails?.subscriptionDetails as { features: string[]; duration: string; key: string; _id: string; name: string; price: number; purchaseType: string; displayName: string; description: string; scheduledDate?: string; [key: string]: unknown }[]}
        mediaDetails={premiumModelDetails?.mediaDetails as { logo: string; coverImage: string; featureImage: string; educatorDetails: { firstName?: string; lastName?: string; [key: string]: unknown } }}
        isEducation
      />
    </ApiResponseWrapper>
  )
}

export default CourseDetails
