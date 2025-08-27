import { Box, Button, Divider, useTheme, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { useBuyPremiumSubscriptionMutation } from '../../../../../services/admin'
import { educationApi } from '../../../../../services/education'

const ReviewEducation = ({ transactionInfo, setCurrentStep, closeModal, purchaseDetails }) => {
  console.warn({ purchaseDetails })

  const theme = useTheme()
  const dispatch = useDispatch()
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
          Billing Details:
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
          Payable Now:
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
            <b>Note:</b> Please do not refresh the page when transaction is in-progress.
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
              Pay Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

ReviewEducation.propTypes = {
  transactionInfo: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    country: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    address: PropTypes.string,
  }),
  setCurrentStep: PropTypes.func,
  closeModal: PropTypes.func,
  purchaseDetails: PropTypes.shape({
    purchaseType: PropTypes.string,
    title: PropTypes.string,
    _id: PropTypes.string,
    scheduledDate: PropTypes.string,
    thumbNail: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

export default ReviewEducation
