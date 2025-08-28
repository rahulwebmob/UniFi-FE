import { Typography, Box } from '@mui/material'
import { useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { useGetParticularWebinarDetailQuery } from '../../../../services/education'
import ApiResponseWrapper from '../../../../shared/components/api-middleware'
import PremiumModal from '../../../../shared/components/layout/premium'
import WebinarContent from '../Webinar/webinar-content'

const WebinarDetails = () => {
  const { id } = useParams()
  const subscriptionRef = useRef()

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

  const handlePurchase = () => {
    subscriptionRef.current.openModal()
  }

  const handleWebinarDetail = useMemo(
    () => ({
      ...data?.data,
    }),
    [data],
  )

  return (
    <ApiResponseWrapper error={error} isLoading={isLoading} isData={!!data?.data}>
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" mb={1}>
          <Typography className="bookmap" variant="h1">
            Webinar Details
          </Typography>
        </Box>
      </Box>
      <WebinarContent
        isEdit={false}
        webinarData={handleWebinarDetail}
        handlePurchase={handlePurchase}
      />
      <PremiumModal
        ref={subscriptionRef}
        purchaseDetails={premiumModelDetails?.subscriptionDetails?.[0]}
      />
    </ApiResponseWrapper>
  )
}

export default WebinarDetails
