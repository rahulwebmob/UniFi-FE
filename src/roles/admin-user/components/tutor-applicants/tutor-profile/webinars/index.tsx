import React from 'react'
import moment from 'moment-timezone'
import { useParams } from 'react-router-dom'

import { Box, Chip, Divider, Tooltip, Typography } from '@mui/material'

import { useGetWebinarDetailsQuery } from '../../../../../../services/admin'

interface Webinar {
  _id: string
  thumbNail?: string
  title?: string
  description?: string
  category?: string[]
  price?: number
  startDate?: string
  startTime?: string
  endTime?: string
  totalEnrolled?: number
}

interface WebinarDetailsResponse {
  webinars: Webinar[]
}

const Webinars = () => {
  const { id } = useParams()
  const { data: webinarDetails } = useGetWebinarDetailsQuery({
    educatorId: id,
  }) as { data: WebinarDetailsResponse | undefined }

  const webinarsData: Webinar[] = webinarDetails?.webinars ?? []

  const isTooltipVisible = (description: string | undefined) =>
    (description ?? '').split(/\s+/).length > 40

  return (
    <Box>
      <Typography component="p" mt={2} mb={1} display="block">
        Webinars
      </Typography>

      {webinarsData.length ? (
        <Box
          display="flex"
          gap="10px"
          flexWrap="wrap"
          sx={{
            '& .award': {
              background: (theme) => theme.palette.primary.light,
              p: 2,
              borderRadius: '12px',
              width: '330px',
            },
          }}
        >
          {webinarsData.map((webinar) => {
            const localStartDate = webinar?.startDate
              ? moment.utc(webinar.startDate).local()
              : null

            const formattedDate = localStartDate
              ? localStartDate.format('MM/DD/YYYY')
              : '-'

            const formattedStartTime =
              webinar?.startTime && localStartDate
                ? moment
                    .utc(
                      `${localStartDate.format('YYYY-MM-DD')}T${
                        webinar.startTime
                      }`,
                    )
                    .local()
                    .format('HH:mm')
                : '-'

            const formattedEndTime =
              webinar?.endTime && localStartDate
                ? moment
                    .utc(
                      `${localStartDate.format('YYYY-MM-DD')}T${
                        webinar.endTime
                      }`,
                    )
                    .local()
                    .format('HH:mm')
                : '-'

            return (
              <Box className="award" key={webinar?._id}>
                <Box
                  sx={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '300px',
                  }}
                  component="img"
                  src={webinar?.thumbNail ?? ''}
                  alt="Description of the image"
                />
                <Typography component="p" display="block" my={1}>
                  {webinar?.title ?? '-'}
                </Typography>
                <Tooltip
                  title={webinar?.description ?? '-'}
                  disableHoverListener={!isTooltipVisible(webinar?.description)}
                >
                  <Typography
                    component="p"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                      boxSizing: 'border-box',
                    }}
                  >
                    {webinar?.description ?? '-'}
                  </Typography>
                </Tooltip>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                  flexWrap="wrap"
                  gap="5px"
                >
                  {webinar?.category?.map((categoryName) => (
                    <Chip
                      key={categoryName}
                      size="small"
                      variant="contained"
                      color="primary"
                      label={categoryName ?? '-'}
                    />
                  ))}
                  <Typography component="p" color="primary.main">
                    at ${webinar?.price ?? 0}
                  </Typography>
                </Box>
                <Box display="flex" gap="3px" my={1}>
                  <Typography component="p">
                    {webinar?.startDate
                      ? `${formattedDate} at ${formattedStartTime} - ${formattedEndTime}`
                      : '-'}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 1,
                    borderColor: (theme) => theme.palette.grey.light,
                  }}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body1">
                    {webinar?.totalEnrolled ?? 0} enrollment
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" mt={2}>
          No webinars available.
        </Typography>
      )}
    </Box>
  )
}

export default Webinars
