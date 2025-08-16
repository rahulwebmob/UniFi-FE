import React from 'react'
import { format } from 'date-fns'
import { Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Divider, useTheme, Typography } from '@mui/material'

import {
  useGetUserCouponsQuery,
  useLazyGetDiscountPriceQuery,
} from '../../../../../Services/admin'

const CouponList = ({
  closeModal,
  setDiscount,
  subscriptionType,
  setSelectedCoupon,
}) => {
  const [discountPrice] = useLazyGetDiscountPriceQuery()
  const { t } = useTranslation('application')
  const { data } = useGetUserCouponsQuery({
    modules: subscriptionType,
  })
  const theme = useTheme()

  const handleDiscount = async (coupon) => {
    const response = await discountPrice({
      couponName: coupon,
      module: subscriptionType,
    })
    if (!response?.error) {
      const totalDiscount = response?.data?.data?.reduce(
        (acc, item) => acc + (item.price - item.updatedPrice),
        0,
      )
      setDiscount(totalDiscount)
      setSelectedCoupon(coupon)
      closeModal()
    }
  }

  return (
    <Box>
      <Typography variant="h6">Available Coupons</Typography>
      <Divider
        sx={{
          my: 1,
          borderColor: theme.palette.primary.main,
        }}
      />
      {!data?.data?.length ? (
        <Typography component="p">
          {t('application:UI.COUPAN_LIST.NO_COUPAN')}
        </Typography>
      ) : (
        <>
          {data?.data?.map((coupon) => (
            <Box key={coupon?.id} my={1}>
              <Box display="flex" justifyContent="space-between">
                <Box my={1}>
                  <Box display="flex" alignItems="center" gap={1} padding="10px">
                    <Tag size={20} color={theme.palette.primary.main} />
                    <Typography component="p" className="CoupanName">
                      {coupon?.name}
                    </Typography>
                  </Box>
                  <Typography component="span" ml={2}>
                    Save: {coupon?.amount}%
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={(event) => {
                      event.stopPropagation()
                      event.preventDefault()
                      void handleDiscount(coupon.name)
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Apply
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography component="p" color="secondary.main">
                  Valid until {format(new Date(coupon?.expiryDate), 'MM-dd-yy')}
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

export default CouponList
