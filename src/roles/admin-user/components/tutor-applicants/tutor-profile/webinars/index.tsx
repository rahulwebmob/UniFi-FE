import moment from 'moment-timezone'
import { useParams } from 'react-router-dom'

import { Box, Chip, Divider, Tooltip, Typography } from '@mui/material'

import { useGetWebinarDetailsQuery } from '../../../../../../services/admin'
import type {
  WebinarData,
  EducatorProfileResponse,
} from '../../../../../../types/education.types'

const Webinars = () => {
  const { id } = useParams()
  const { data: webinarDetails } = useGetWebinarDetailsQuery({
    educatorId: id || '',
  }) as { data: EducatorProfileResponse | undefined }

  const webinarsData: WebinarData[] = webinarDetails?.data?.webinars ?? []

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
            const startDateTime = webinar?.startTime
              ? moment.utc(webinar.startTime).local()
              : null

            const endDateTime = webinar?.endTime
              ? moment.utc(webinar.endTime).local()
              : null

            const formattedDate = startDateTime
              ? startDateTime.format('MM/DD/YYYY')
              : '-'

            const formattedStartTime = startDateTime
              ? startDateTime.format('HH:mm')
              : '-'

            const formattedEndTime = endDateTime
              ? endDateTime.format('HH:mm')
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
                  src={webinar?.thumbnail ?? webinar?.thumbNail ?? ''}
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
                      variant="filled"
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
                    {webinar?.startTime
                      ? `${formattedDate} at ${formattedStartTime} - ${formattedEndTime}`
                      : '-'}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 1,
                    borderColor: (theme) => theme.palette.grey[300],
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
