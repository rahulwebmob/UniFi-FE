import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'

import {
  Box,
  Radio,
  Button,
  Divider,
  CardMedia,
  RadioGroup,
  Typography,
  FormControl,
  FormControlLabel,
} from '@mui/material'

import { ENV } from '../../../../../utils/env'

interface MediaDetails {
  title?: string
  thumbnail?: string
  coverImage?: string
  logo?: string
  [key: string]: string | undefined
}

interface SubscriptionDetail {
  _id?: string
  price?: number
  duration?: string
  displayName?: string
  features?: string[]
  note?: string
  coverImage?: string
  logo?: string
  [key: string]: string | number | string[] | undefined
}

interface SubscriptionDetailsProps {
  mediaDetails: MediaDetails
  subscriptionDetails: SubscriptionDetail[]
  setCurrentStep: (step: number) => void
  setSubscriptionFormData: React.Dispatch<
    React.SetStateAction<Record<string, unknown>>
  >
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  mediaDetails,
  subscriptionDetails,
  setCurrentStep,
  setSubscriptionFormData,
}) => {
  const { t } = useTranslation('application')
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionDetail | undefined
  >(subscriptionDetails?.[0])
  const COVER_IMG = `${ENV.CDN}${mediaDetails?.coverImage}`
  const LOGO_IMG = `${ENV.CDN}${mediaDetails?.logo}`

  useEffect(() => {
    setSubscriptionFormData((prev) => ({
      ...prev,
      selectedPlans: [selectedPlan],
    }))
  }, [selectedPlan, setSubscriptionFormData])

  const isKeyUnique = (key: string) => {
    const encounteredValues = new Set()
    let isUnique = true

    subscriptionDetails?.forEach((obj) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        if (encounteredValues.has(value)) {
          isUnique = false
        }
        encounteredValues.add(value)
      }
    })
    return isUnique
  }

  const getKeyValue = (item: SubscriptionDetail): string =>
    isKeyUnique('duration') ? item?.duration || '' : item?.displayName || ''

  return (
    <>
      <Box>
        <CardMedia
          component="img"
          height="168"
          image={COVER_IMG}
          alt="Cover image"
          crossOrigin="anonymous"
          sx={{ borderRadius: '16px 16px 0 0' }}
        />
      </Box>
      <Box sx={{ pl: 3, pr: 3 }}>
        <Box
          display="flex"
          alignItems="flex-end"
          sx={{ mt: -5, display: { sm: 'flex', xs: 'block' } }}
        >
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              objectFit: 'contain',
              borderRadius: '4px',
              padding: '4px',
              mr: 2,
            }}
            component="img"
            src={LOGO_IMG}
            width={80}
            height={80}
            crossOrigin="anonymous"
          />
          <Typography variant="h5">{selectedPlan?.displayName}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {selectedPlan?.description}
          </Typography>
        </Box>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box>
          <Typography variant="body2">
            {t('application:PREMIUM_MODAL.BILL_FREQUENCY')}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="plans-radio-buttons-group-label"
                  name="plans-radio-buttons-group"
                  value={selectedPlan ? getKeyValue(selectedPlan) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const key = isKeyUnique('duration')
                      ? 'duration'
                      : 'displayName'
                    const matchedPlan = subscriptionDetails?.find(
                      (plan) => plan[key] === e.target.value,
                    )
                    setSelectedPlan(matchedPlan || undefined)
                  }}
                >
                  {subscriptionDetails?.map((item, index) => (
                    <FormControlLabel
                      key={item._id || index}
                      value={getKeyValue(item)}
                      control={<Radio />}
                      label={
                        getKeyValue(item).charAt(0).toUpperCase() +
                        getKeyValue(item).slice(1)
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
              <Typography variant="h1" color="primary">
                {selectedPlan?.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                /{selectedPlan?.duration}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box>
          <Typography variant="body2">
            {t('application:PREMIUM_MODAL.PREMIUM_FEATURES')}
          </Typography>
          <Box sx={{ mt: 1, maxHeight: 120, overflow: 'auto' }}>
            {selectedPlan?.features?.map((feature: string, index: number) => (
              <Box
                key={feature || index}
                display="flex"
                alignItems="center"
                sx={{
                  mb: 1,
                  '& svg': {
                    color: (theme) => theme.palette.primary.main,
                    fontSize: '24px',
                    mr: 1,
                  },
                }}
              >
                <CheckCircle size={20} />
                <Typography>{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 2 }} />

        {selectedPlan?.note && (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {t('application:PREMIUM_MODAL.NOTE')}: {selectedPlan.note}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => setCurrentStep(2)}
          >
            {t('application:PREMIUM_MODAL.SUBSCRIBE')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default SubscriptionDetails
