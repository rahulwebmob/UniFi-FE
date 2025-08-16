import * as yup from 'yup'
import React, { useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Button,
  useTheme,
  TextField,
  Typography,
  FormControl,
  useMediaQuery,
} from '@mui/material'

import useWindowOpen from '../../../../../hooks/useWindowOpen'
import { useMyProfileMutation } from '../../../../../services/admin'
import { urlRegexPatterns } from '../../../../../roles/educator-user/pages/constant/constant'

interface SocialMediaItem {
  mediaType: 'linkedin' | 'twitter' | 'facebook' | 'website'
  mediaUrl?: string
}

interface SocialMediaFormValues {
  linkedin: string
  twitter: string
  facebook: string
  website: string
}

interface SocialMediaProps {
  socialMediaUrls?: SocialMediaItem[]
  isPermission: boolean
}

const SocialMedia = ({ socialMediaUrls, isPermission }: SocialMediaProps) => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const [editDetails] = useMyProfileMutation()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const openWindow = useWindowOpen()

  const schemaResolver = yupResolver(
    yup.object().shape({
      linkedin: yup
        .string()
        .trim()
        .matches(urlRegexPatterns.linkedIn, {
          message: t('application:PROFILE.VALIDATION_LINKEDIN'),
          excludeEmptyString: true,
        }),
      twitter: yup
        .string()
        .trim()
        .matches(urlRegexPatterns.twitter, {
          message: t('application:PROFILE.VALIDATION_TWITTER'),
          excludeEmptyString: true,
        }),
      facebook: yup
        .string()
        .trim()
        .matches(urlRegexPatterns.facebookUrl, {
          message: t('application:PROFILE.VALIDATION_FACEBOOK'),
          excludeEmptyString: true,
        }),
      website: yup
        .string()
        .trim()
        .matches(urlRegexPatterns.website, {
          message: t('application:PROFILE.VALIDATION_WEBSITE'),
          excludeEmptyString: true,
        }),
    }),
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      linkedin: '',
      twitter: '',
      facebook: '',
      website: '',
    },
  })

  const onSubmit = (values: SocialMediaFormValues) => {
    const httpsAdded = (url: string) => {
      if (url && !url.startsWith('http')) {
        return `https://${url}`
      }
      return url
    }
    values.linkedin = httpsAdded(values.linkedin)
    values.twitter = httpsAdded(values.twitter)
    values.facebook = httpsAdded(values.facebook)
    values.website = httpsAdded(values.website)

    const socialMediaData: SocialMediaItem[] = [
      { mediaType: 'linkedin', mediaUrl: values.linkedin || '' },
      { mediaType: 'twitter', mediaUrl: values.twitter || '' },
      { mediaType: 'facebook', mediaUrl: values.facebook || '' },
      { mediaType: 'website', mediaUrl: values.website || '' },
    ]

    void editDetails({ socialMediaUrls: socialMediaData })
  }

  const handleFormSubmit = (values: SocialMediaFormValues) => {
    void onSubmit(values)
    return
  }

  useEffect(() => {
    socialMediaUrls?.forEach((socialItem) => {
      setValue(socialItem.mediaType, socialItem.mediaUrl ?? '')
    })
  }, [socialMediaUrls, setValue])

  const getUrl = (type: SocialMediaItem['mediaType'], openNewTab = false): string | null => {
    const urlData = socialMediaUrls?.find((item) => item.mediaType === type)

    if (openNewTab && urlData?.mediaUrl) {
      openWindow(urlData.mediaUrl)
      return null
    }

    return urlData?.mediaUrl ?? null
  }

  return (
    <Box>
      <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(handleFormSubmit)(e); }}>
        <Box>
          <FormControl fullWidth>
            <Typography variant="h6" className="profileTitle">
              {t('application:PROFILE.SOCAIL_MEDIA')}
            </Typography>
          </FormControl>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'}
          gap="16px"
        >
          <FormControl fullWidth>
            <Typography
              component="p"
              display="flex"
              justifyContent="space-between"
            >
              {t('application:PROFILE.LINKEDIN_PROFILE')}
              {getUrl('linkedin') && (
                <ExternalLink
                  size={16}
                  style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                  onClick={() => getUrl('linkedin', true)}
                />
              )}
            </Typography>
            <Controller
              name="linkedin"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder={
                    isPermission &&
                    t('application:PROFILE.PLACEHOLDER_LINKEDIN')
                  }
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                  disabled={!isPermission}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography
              component="p"
              display="flex"
              justifyContent="space-between"
            >
              {t('application:PROFILE.TWITTER_PROFILE')}
              {getUrl('twitter') && (
                <ExternalLink
                  size={16}
                  style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                  onClick={() => getUrl('twitter', true)}
                />
              )}
            </Typography>
            <Controller
              name="twitter"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder={
                    isPermission && t('application:PROFILE.PLACEHOLDER_TWITTER')
                  }
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.twitter}
                  helperText={errors.twitter?.message}
                  disabled={!isPermission}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography
              component="p"
              display="flex"
              justifyContent="space-between"
            >
              {t('application:PROFILE.FACEBOOK_PROFILE')}
              {getUrl('facebook') && (
                <ExternalLink
                  size={16}
                  style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                  onClick={() => getUrl('facebook', true)}
                />
              )}
            </Typography>
            <Controller
              name="facebook"
              size="small"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder={
                    isPermission &&
                    t('application:PROFILE.PLACEHOLDER_FACEBOOK')
                  }
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.facebook}
                  helperText={errors.facebook?.message}
                  disabled={!isPermission}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography
              component="p"
              display="flex"
              justifyContent="space-between"
            >
              {t('application:PROFILE.WEBSITE_LINK')}
              {getUrl('website') && (
                <ExternalLink
                  size={16}
                  style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                  onClick={() => getUrl('website', true)}
                />
              )}
            </Typography>
            <Controller
              name="website"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder={
                    isPermission && t('application:PROFILE.PLACEHOLDER_WEBSITE')
                  }
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.website}
                  helperText={errors.website?.message}
                  disabled={!isPermission}
                />
              )}
            />
          </FormControl>
        </Box>
        {isPermission && (
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              mt: 1,
            }}
          >
            {t('application:MISCELLANEOUS.SAVE')}
          </Button>
        )}
      </form>
    </Box>
  )
}

export default SocialMedia
