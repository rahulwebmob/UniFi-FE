import { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@mui/material'

import WebinarContent from '../Webinar/webinar-content'
import ApiResponseWrapper from '../../../../shared/components/api-middleware'
import { useGetParticularWebinarDetailQuery } from '../../../../Services/education'
import PremiumModal from '../../../../shared/components/layout/premium/premium-modal/PremiumModal'

const WebinarDetails = () => {
  const { id } = useParams()
  const subscriptionRef = useRef(null)
  const { t } = useTranslation('education')

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
    subscriptionRef.current.openModal()
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
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" mb={1}>
          <Typography className="bookmap" variant="h1">
            {t('education:EDUCATION_DASHBOARD.WEBINAR_DETAILS.WEBINAR_DETAILS')}
          </Typography>
        </Box>
      </Box>
      <WebinarContent
        isEdit={false}
        webinarData={handleCourseData}
        handleOpenPremiumModal={handleOpenPremiumModal}
      />
      <PremiumModal
        ref={subscriptionRef}
        className="buy-subscription-button"
        subscriptionDetails={premiumModelDetails?.subscriptionDetails}
        mediaDetails={premiumModelDetails?.mediaDetails}
        isEducation
      />
    </ApiResponseWrapper>
  )
}

export default WebinarDetails
