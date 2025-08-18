import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import WebinarContent from '../Webinar/webinar-content'
import PremiumModal from '../../../../shared/components/layout/premium'
import ApiResponseWrapper from '../../../../shared/components/api-middleware'
import { useGetParticularWebinarDetailQuery } from '../../../../services/education'
import type { WebinarDetail } from '../../../../types/api.types'
import type { WebinarData } from '../../../../types/education.types'

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
    const webinarResponse = data as { data?: WebinarDetail }
    const item = webinarResponse?.data
    return {
      mediaDetails: {
        logo: item?.thumbNail || item?.thumbnail || '',
        coverImage: item?.thumbNail || item?.thumbnail || '',
        featureImage: item?.thumbNail || item?.thumbnail || '',
        educatorDetails: {
          firstName:
            (item?.instructor as { firstName?: string })?.firstName || '',
          lastName: (item?.instructor as { lastName?: string })?.lastName || '',
          id:
            (item?.educatorId as string) ||
            item?.instructor?.id ||
            'default-educator',
        },
      },
      subscriptionDetails: [
        {
          features: [],
          duration: '',
          key: item?._id || item?.id || 'default-key',
          _id: item?._id || item?.id || 'default-id',
          name: item?.title || '',
          price: item?.price || 0,
          purchaseType: 'WEBINAR' as const,
          displayName: item?.title || '',
          description: item?.subtitle || item?.description || '',
          scheduledDate: item?.webinarScheduledObj?.join_date,
        },
      ],
    }
  }, [data])

  const handleOpenPremiumModal = () => {
    subscriptionRef.current?.openModal()
  }

  const handleCourseData = useMemo((): WebinarData => {
    const webinarResponse = data as { data?: WebinarDetail }
    const webinarDetail = webinarResponse?.data

    if (!webinarDetail) {
      // Return a minimal valid WebinarData object
      return {
        _id: '',
        title: '',
        description: '',
        thumbnail: '',
        startTime: '',
        endTime: '',
        duration: 0,
        status: 'draft' as const,
      }
    }

    // Transform WebinarDetail to WebinarData
    return {
      ...webinarDetail,
      _id: webinarDetail._id || webinarDetail.id || '',
      title: webinarDetail.title || '',
      description: webinarDetail.description || '',
      thumbnail: webinarDetail.thumbnail || webinarDetail.thumbNail || '',
      startTime: webinarDetail.startTime || '',
      endTime: webinarDetail.endTime || '',
      duration: webinarDetail.duration || 0,
      status: webinarDetail.status || ('draft' as const),
    }
  }, [data])

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
        purchaseDetails={premiumModelDetails?.subscriptionDetails?.[0]}
      />
    </ApiResponseWrapper>
  )
}

export default WebinarDetails
