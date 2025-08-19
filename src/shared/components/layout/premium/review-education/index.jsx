import { Box, Button, Divider, useTheme, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useBuyPremiumSubscriptionMutation } from '../../../../../services/admin'
import { educationApi } from '../../../../../services/education'

const ReviewEducation = ({ transactionInfo, setCurrentStep, closeModal, purchaseDetails }) => {
  console.warn({ purchaseDetails })

  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation('application')
  const [buyPremiumSubscription, { isLoading }] = useBuyPremiumSubscriptionMutation()

  const { firstName, lastName, country, state, city, address } = transactionInfo

  const billingAddress = useMemo(
    () => `${firstName} ${lastName}, ${country}, ${state}, ${city}, ${address}`,
    [firstName, lastName, country, state, city, address],
  )

  const handlePayment = async () => {
    const purchaseType = purchaseDetails?.purchaseType
    const basePayload = {
      planId: purchaseDetails?._id || '',
      ...transactionInfo,
      subscriptionType: purchaseType,
    }

    if (purchaseType === 'COURSE') {
      basePayload.courseId = purchaseDetails?._id
    } else if (purchaseType === 'WEBINAR') {
      basePayload.webinarId = purchaseDetails?._id
      if (purchaseDetails?.scheduledDate) {
        basePayload.scheduledDate = purchaseDetails.scheduledDate
      }
    }

    const response = await buyPremiumSubscription(basePayload)

    if (!response.error) {
      if (purchaseType === 'COURSE') {
        dispatch(educationApi.util.invalidateTags(['Course']))
        dispatch(educationApi.util.invalidateTags(['All-Course']))
      } else {
        dispatch(educationApi.util.invalidateTags(['Webinar']))
        dispatch(educationApi.util.invalidateTags(['All-Webinar']))
      }
      closeModal()
    }
  }

  return (
    <Box
      sx={{
        '& .MuiTypography-root': {
          fontWeight: '100',
        },
        '& .MuiTypography-h5': {
          fontSize: '1em',
          fontWeight: '600',
        },
        '& .BillingDetail': {
          display: 'flex',
          justifyContent: 'space-between',
        },
        '& .SavedBilling': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: '5px',
          '& .savedDetail': {
            color: theme.palette.success.main,
            fontSize: '1em',
            '& .subtotal': {
              textDecoration: 'line-through',
            },
          },
        },
        '& .TotalBilling': {
          display: 'flex',
          justifyContent: 'space-between',
        },
        '& .CoupanCode': {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        },
      }}
    >
      <Box p={3}>
        <Typography component="p" display="block" mt={2}>
          {t('application:PREMIUM_MODAL.BILLING_DETAILS')}
        </Typography>
        <Typography color="text.secondary" sx={{ wordWrap: 'break-word' }} component="p" mt={1}>
          {billingAddress}
        </Typography>

        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />
        <Box className="BillingDetail">
          <Typography component="p" display="block" mb={1}>
            Content Details
          </Typography>
        </Box>
        <Box>
          <Box className="BillingDetail" color="text.secondary">
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                component="img"
                src={purchaseDetails?.thumbNail}
                alt={purchaseDetails?.title}
                sx={{ width: '50px', height: '50px', borderRadius: '8px' }}
              />
              <Typography component="span"> {purchaseDetails?.title}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box px={3} pb={3}>
        <Box className="TotalBilling">
          {t('application:PREMIUM_MODAL.PAYBALE')}
          <Typography> ${purchaseDetails?.price}</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          sx={{
            flexDirection: {
              xs: 'column-reverse',
              sm: 'column-reverse',
              md: 'row',
            },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            maxWidth={300}
            fontSize="13px"
            fontWeight={100}
          >
            <b>{t('application:PREMIUM_MODAL.NOTE')}:</b>{' '}
            {t('application:PREMIUM_MODAL.TRANSACTION_INFO')}
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setCurrentStep(1)}
              sx={{ borderRadius: '8px' }}
            >
              Back
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                void handlePayment()
              }}
              variant="contained"
              sx={{ borderRadius: '8px', fontWeight: 600 }}
            >
              {t('application:PREMIUM_MODAL.PAY_NOW')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewEducation
