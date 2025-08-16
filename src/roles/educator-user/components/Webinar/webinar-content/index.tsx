import React from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Card,
  Grid,
  alpha,
  Avatar,
  Button,
  Container,
  CardMedia,
  Typography,
} from '@mui/material'

import { getEducatorDetails } from '../../common/common'
import { getLocaleByLanguageCode } from '../../../../../utils/globalUtils'

const WebinarContent = ({ webinarData, isEdit, handleOpenPremiumModal }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('education')
  const locale = getLocaleByLanguageCode(i18n.language)

  const renderEnrollButton = () =>
    !webinarData?.isWebinarBought && webinarData?.isPaid ? (
      <Button
        fullWidth
        disabled={isEdit}
        color="secondary"
        variant="contained"
        onClick={handleOpenPremiumModal}
      >
        {t('EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.ENROLL_NOW')}
      </Button>
    ) : (
      <Button
        fullWidth
        color="secondary"
        variant="contained"
        disabled={isEdit || !webinarData?.webinarScheduledObj?.can_join}
        onClick={() => {
          void navigate(`/dashboard/webinar/${webinarData?._id}`)
        }}
      >
        {webinarData?.webinarScheduledObj?.can_join
          ? t('EDUCATION_DASHBOARD.COMMON_KEYS.JOIN_NOW')
          : t('EDUCATION_DASHBOARD.COMMON_KEYS.MEETING_WILL_START_SOON')}
      </Button>
    )

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: '8px',
        background: (theme) => theme.palette.primary.light,
        '& .MuiTypography-root': {
          fontFamily: 'inter',
        },
      }}
    >
      <Container
        sx={{
          width: '100%',
          '@media (min-width:1200px)': { maxWidth: '1400px' },
        }}
        maxWidth="lg"
      >
        <Box
          sx={{
            padding: 1,
            borderRadius: '8px',
            background: (theme) => theme.palette.primary[100],
          }}
        >
          <Grid
            container
            spacing={1}
            sx={{
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
              <Typography variant="h1">{webinarData?.title}</Typography>

              <Box mt={1}>
                <Typography component="p" color="secondary" display="block">
                  {t('EDUCATION_DASHBOARD.COMMON_KEYS.CREATED_BY')}
                </Typography>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="3px"
                  sx={{
                    background: (theme) => theme.palette.primary.light,
                    padding: 1,
                    borderRadius: '8px',
                  }}
                >
                  <Avatar sx={{ width: '30px', height: '30px' }}>
                    <Typography variant="body2">
                      {getEducatorDetails(webinarData, 'avatarName')}
                    </Typography>
                  </Avatar>
                  <Typography variant="body1" color="primary">
                    {getEducatorDetails(webinarData, 'fullName')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6, lg: 6 }}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Card
                sx={{
                  width: '450px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid ',
                  borderColor: (theme) => theme.palette.primary[100],
                  background: 'none',
                }}
              >
                <Box sx={{ width: '100%', height: '222px' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    image={webinarData?.thumbNail}
                    title={t(
                      'EDUCATION_DASHBOARD.WEBINAR_DETAILS.WEBINAR_CONTENT.WEBINAR_THUMBNAIL',
                    )}
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                  sx={{
                    borderRadius: '30px',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.primary.main,
                    background: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                    padding: '5px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '30px', fontWeight: '500' }}
                  >
                    {webinarData?.webinarScheduledObj?.join_date
                      ? format(
                          new Date(webinarData?.webinarScheduledObj?.join_date),
                          'dd MMMM yyyy',
                          { locale },
                        )
                      : '-'}
                  </Button>
                  <Typography variant="body1" color="white" fontWeight={500}>
                    {t('EDUCATION_DASHBOARD.MAIN_PAGE.TIME', {
                      time: webinarData?.webinarScheduledObj?.join_date
                        ? format(
                            new Date(
                              webinarData?.webinarScheduledObj?.join_date,
                            ),
                            'hh:mm aaaa',
                            { locale },
                          )
                        : '-',
                    })}
                  </Typography>
                </Box>

                {!webinarData?.isWebinarBought && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    my={1}
                  >
                    <Typography component="p">
                      {t(
                        'EDUCATION_DASHBOARD.WEBINAR_DETAILS.WEBINAR_CONTENT.WEBINAR_PRICE',
                      )}
                    </Typography>
                    <Typography component="p" fontWeight={600}>
                      {webinarData.isPaid
                        ? `$${webinarData?.price}`
                        : t('EDUCATION_DASHBOARD.COMMON_KEYS.FREE')}
                    </Typography>
                  </Box>
                )}
                {renderEnrollButton()}
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Typography display="flex" variant="body1" color="secondary" my={1}>
          {webinarData?.description || '-'}
        </Typography>
      </Container>
    </Box>
  )
}

export default WebinarContent
