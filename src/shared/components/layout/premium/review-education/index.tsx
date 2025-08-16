import  { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Divider,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material'

import { educationApi } from '../../../../../services/education'
import { useBuyPremiumSubscriptionMutation } from '../../../../../services/admin'

interface TransactionInfo {
  cardHolderName?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  [key: string]: unknown
}

interface SubscriptionDetails {
  [key: string]: unknown
}

interface ReviewEducationProps {
  transactionInfo: TransactionInfo
  setCurrentStep: (step: number) => void
  closeModal: () => void
  subscriptionDetails: SubscriptionDetails
}

const ReviewEducation = ({
  transactionInfo,
  setCurrentStep,
  closeModal,
  subscriptionDetails,
}: ReviewEducationProps) => {
  console.warn({ subscriptionDetails })

  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation('application')
  const [buyPremiumSubscription, { isLoading }] =
    useBuyPremiumSubscriptionMutation()

  const { firstName, lastName, country, state, city, address } = transactionInfo

  const billingAddress = useMemo(
    () => `${firstName} ${lastName}, ${country}, ${state}, ${city}, ${address}`,
    [firstName, lastName, country, state, city, address],
  )

  const handlePayment = async () => {
    const purchaseType = subscriptionDetails?.[0]?.purchaseType
    const payload: Record<string, unknown> = {
      ...transactionInfo,
      subscriptionType: purchaseType,
    }

    if (purchaseType === 'COURSE') {
      payload.courseId = (subscriptionDetails as unknown as Array<{ _id: string }>)?.[0]?._id
    } else if (purchaseType === 'WEBINAR') {
      payload.webinarId = (subscriptionDetails as unknown as Array<{ _id: string; scheduledDate?: string }>)?.[0]?._id
      payload.scheduledDate = (subscriptionDetails as unknown as Array<{ scheduledDate?: string }>)?.[0]?.scheduledDate
    }

    const response = await buyPremiumSubscription(payload)

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
      <Box p={2} pb={1} display="flex" alignItems="center">
        <IconButton disableRipple>
          <ArrowLeft
            size={20}
            style={{ cursor: 'pointer', marginRight: 2 }}
            onClick={() => setCurrentStep(2)}
          />
        </IconButton>
        <Typography variant="h6">
          {t('application:PREMIUM_MODAL.REVIEW_ORDER')}
        </Typography>
        <Divider
          sx={{
            my: 1,
            borderColor: theme.palette.primary.main,
          }}
        />
      </Box>
      <Box pl={2} pr={2}>
        <Typography component="p" display="block" mt={2}>
          {t('application:PREMIUM_MODAL.BILLING_DETAILS')}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ wordWrap: 'break-word' }}
          component="p"
          mt={1}
        >
          {billingAddress}
        </Typography>

        <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />
        <Box className="BillingDetail">
          <Typography component="p" display="block" mb={1}>
            {t('application:PREMIUM_MODAL.SUBSCRIBED_PLAN')}
          </Typography>
        </Box>
        <Box>
          <Box className="BillingDetail" color="text.secondary">
            <Typography component="span">
              {' '}
              {subscriptionDetails[0]?.displayName}
            </Typography>
            <Typography> ${subscriptionDetails[0]?.price}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />

      <Box px={2} pb={2}>
        <Box className="TotalBilling">
          {t('application:PREMIUM_MODAL.PAYBALE')}
          <Typography> ${subscriptionDetails[0]?.price}</Typography>
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
            <b>{t('application:PREMIUM_MODAL.NOTE')}:</b>
            {t('application:PREMIUM_MODAL.TRANSACTION_INFO')}
          </Typography>
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
  )
}

export default ReviewEducation
