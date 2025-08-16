import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { useRef, useMemo, useState } from 'react'
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react'

import {
  Box,
  Button,
  Divider,
  useTheme,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'

import * as Style from './style'
import CouponList from '../coupon-list'
import ModalBox from '../../../../components/ui-elements/modal-box'
import { errorAlert } from '../../../../../Redux/Reducers/AppSlice'
import {
  updateToken,
  updateSubscription,
} from '../../../../../Redux/Reducers/UserSlice'
// import { dashboardApi } from '../../../../../services/dashboard' // Dashboard service not available
import {
  adminApi,
  useLazyGetDiscountPriceQuery,
  useBuyPremiumSubscriptionMutation,
} from '../../../../../Services/admin'

const ReviewOrder = ({ transactionInfo, setCurrentStep, closeModal }) => {
  const ref = useRef()
  const { t } = useTranslation('application')
  const theme = useTheme()
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [buyPremiumSubscription, { isLoading }] =
    useBuyPremiumSubscriptionMutation()
  const [discountPrice] = useLazyGetDiscountPriceQuery()

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
      couponName: selectedCoupon,
      subscriptionType: selectedPlans.map((item) => item.name),
    })

    if (!res.error) {
      const newToken = res?.data?.token
      localStorage.removeItem('token')
      dispatch(updateToken({ token: newToken }))
      dispatch(updateSubscription([...selectedPlans]))
      dispatch(adminApi.util.invalidateTags(['Me']))
      dispatch(adminApi.util.invalidateTags(['Subscription']))
    }
    closeModal()
  }

  const handleRemove = () => {
    setDiscount(0)
    setSelectedCoupon('')
    setCouponCode('')
  }

  const applyCoupon = async () => {
    if (!/^[A-Z0-9]{1,20}$/.test(couponCode)) {
      dispatch(
        errorAlert({
          message: t('application:PREMIUM_MODAL.ERROR_COUPON'),
        }),
      )
      return
    }
    const response = await discountPrice({
      couponName: couponCode,
      module: selectedPlans.map((item) => item.name),
    })
    if (!response?.error) {
      const totalDiscount = response?.data?.data?.reduce(
        (acc, item) => acc + (item.price - item.updatedPrice),
        0,
      )

      setDiscount(totalDiscount)
      setSelectedCoupon(couponCode)
    }
  }

  const renderApplyButton = () => {
    const isCouponApplied =
      selectedCoupon && selectedCoupon === couponCode.trim('')
    const isApplyDisabled = isCouponApplied || !couponCode.trim('')

    return (
      <Button
        disabled={isApplyDisabled}
        variant="contained"
        color="primary"
        onClick={() => { void applyCoupon() }}
        startIcon={isCouponApplied && <>tick</>}
      >
        {isCouponApplied ? 'Applied' : 'Apply'}
      </Button>
    )
  }

  return (
    <Style.ReviewDetail>
      <Box p={2} pb={1} display="flex" alignItems="center">
        <IconButton disableRipple>
          <ArrowLeft
            size={20}
            // fontSize={24}
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

      <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />

      <Box pl={2} pr={2}>
        <Box className="BillingDetail">
          <Typography component="p" display="block" mb={1}>
            {t('application:PREMIUM_MODAL.APPLY_COUPON')}
          </Typography>
        </Box>
        <Box className="CoupanCode">
          <TextField
            size="small"
            fullWidth
            placeholder="Coupon Code"
            className="CoupanFeild"
            variant="outlined"
            value={couponCode}
            onChange={(e) => {
              const { value } = e.target
              setCouponCode(value)
              if (!value) {
                handleRemove()
              }
            }}
            InputProps={{
              endAdornment: !!selectedCoupon && (
                <InputAdornment sx={{ cursor: 'pointer' }} position="end">
                  <XCircle size={16} onClick={handleRemove} />
                </InputAdornment>
              ),
            }}
          />

          {renderApplyButton()}
        </Box>
        <Box>
          <Typography
            variant="body1"
            mt={1}
            sx={{ color: theme.palette.primary.main, fontWeight: '600' }}
          >
            {t('application:PREMIUM_MODAL.AVAILABLE_COUPON')}
            <ArrowRight
              size={20}
              cursor="pointer"
              style={{ marginLeft: 2 }}
              onClick={() => ref.current.openModal()}
            />
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 1 }} />

      <Box px={2} pb={2}>
        {!!selectedCoupon && (
          <Box className="TotalBilling">
            {t('application:PREMIUM_MODAL.APPLIED_COUPON_SAVINGS')}
            <Typography>${discount.toFixed(2)}</Typography>
          </Box>
        )}
        <Box className="TotalBilling">
          {t('application:PREMIUM_MODAL.PAYBALE')}
          <Typography>
            ${selectedCoupon ? (totalPrice - discount).toFixed(2) : totalPrice}
          </Typography>
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
      <ModalBox ref={ref} size="sm" isBackdropAllowed={false}>
        <CouponList
          closeModal={() => ref?.current?.closeModal()}
          setSelectedCoupon={(value) => {
            setSelectedCoupon(value)
            setCouponCode(value)
          }}
          subscriptionType={selectedPlans.map((plan) => plan.name)}
          setDiscount={setDiscount}
        />
      </ModalBox>
    </Style.ReviewDetail>
  )
}

export default ReviewOrder
