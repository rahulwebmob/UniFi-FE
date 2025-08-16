import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'

import {
  Box,
  Button,
  Divider,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material'

import * as Style from './style'
import {
  updateToken,
  updateSubscription,
} from '../../../../../Redux/Reducers/UserSlice'
import {
  adminApi,
  useBuyPremiumSubscriptionMutation,
} from '../../../../../Services/admin'

const ReviewOrder = ({ transactionInfo, setCurrentStep, closeModal }) => {
  const { t } = useTranslation('application')
  const theme = useTheme()
  const [buyPremiumSubscription, { isLoading }] =
    useBuyPremiumSubscriptionMutation()

  const { firstName, lastName, country, state, city, address, selectedPlans } =
    transactionInfo
  const dispatch = useDispatch()

  const billingAddress = useMemo(
    () => `${firstName} ${lastName}, ${country}, ${state}, ${city}, ${address}`,
    [firstName, lastName, country, state, city, address],
  )

  const totalPrice = useMemo(
    () => selectedPlans.reduce((acc, item) => acc + item.price, 0),
    [selectedPlans],
  )

  const handlePayment = async () => {
    const res = await buyPremiumSubscription({
      ...transactionInfo,
      subscriptionType: selectedPlans.map((item) => item.name),
    })

    if (!res.error) {
      const newToken = res?.data?.token
      localStorage.removeItem('token')
      dispatch(updateToken({ token: newToken }))
      dispatch(updateSubscription([...selectedPlans]))
      dispatch(adminApi.util.invalidateTags(['Me']))
    }
    closeModal()
  }

  return (
    <Style.ReviewDetail>
      <Box p={2} pb={1} display="flex" alignItems="center">
        <IconButton disableRipple>
          <ArrowLeft
            size={20}
            style={{ cursor: 'pointer', marginRight: 2 }}
            onClick={() => setCurrentStep((prev) => prev - 1)}
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
          {selectedPlans?.map((plan) => (
            <Box
              key={plan._id}
              className="BillingDetail"
              color="text.secondary"
            >
              <Typography component="span">{`${plan.displayName}:`}</Typography>
              <Typography>
                ${plan.price}/{plan.duration}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 1 }} />

      <Box px={2} pb={2}>
        <Box className="TotalBilling">
          {t('application:PREMIUM_MODAL.PAYBALE')}
          <Typography>${totalPrice}</Typography>
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
            onClick={() => { void handlePayment() }}
            variant="contained"
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            {t('application:PREMIUM_MODAL.PAY_NOW')}
          </Button>
        </Box>
      </Box>
    </Style.ReviewDetail>
  )
}

export default ReviewOrder