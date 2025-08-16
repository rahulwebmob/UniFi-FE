import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import WebinarContent from '../Webinar/webinar-content'
import PremiumModal from '../../../../shared/components/layout/premium'
import ApiResponseWrapper from '../../../../shared/components/api-middleware'
import { useGetParticularWebinarDetailQuery } from '../../../../services/education'

interface PremiumModalRef {
  openModal: () => void
  closeModal: () => void
}

const WebinarDetails = () => {
  const { id } = useParams()
  const subscriptionRef = useRef<PremiumModalRef>(null)

  const { data, isLoading, error } = useGetParticularWebinarDetailQuery(
    { webinarId: id },
    { skip: !id, pollingInterval: 5000 },
  )

  const premiumModelDetails = useMemo(() => {
    const item = data?.data
    return {
      mediaDetails: {
        logo: item?.thumbNail,
        coverImage: item?.thumbNail,
        featureImage: item?.thumbNail,
        educatorDetails: item?.educatorId,
      },
      subscriptionDetails: [
        {
          features: [],
          duration: '',
          key: item?._id,
          _id: item?._id,
          name: item?.title,
          price: item?.price,
          purchaseType: 'WEBINAR',
          displayName: item?.title,
          description: item?.subtitle,
          scheduledDate: item?.webinarScheduledObj?.join_date,
        },
      ],
    }
  }, [data])

  const handleOpenPremiumModal = () => {
    subscriptionRef.current?.openModal()
  }

  const handleCourseData = useMemo(
    () => ({
      ...data?.data,
    }),
    [data],
  )

  return (
    <ApiResponseWrapper
      error={error}
      isLoading={isLoading}
      isData={!!data?.data}
    >
      <WebinarContent
        isEdit={false}
        webinarData={handleCourseData}
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

export default WebinarDetails
