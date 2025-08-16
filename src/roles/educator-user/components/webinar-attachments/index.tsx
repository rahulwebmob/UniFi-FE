import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, File, Download } from 'lucide-react'

import { Box, Tooltip, Typography } from '@mui/material'

import { useGetWebinarAttachmentsQuery } from '../../../../services/admin'
import { useGetAttachmentsListQuery } from '../../../../services/education'

const WebinarAttachments = ({ handleOnClose, isHost }) => {
  const { t } = useTranslation('application')
  const useAttachmentQuery = isHost
    ? useGetWebinarAttachmentsQuery
    : useGetAttachmentsListQuery
  const { roomId: webinarId } = useParams()
  const { data } = useAttachmentQuery({ webinarId }, { skip: !webinarId })

  const handleDownloadAttachment = async (value) => {
    const response = await fetch(value.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = value.file
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Box verticalAlign="center" verticalFill>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          padding: 2,
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.primary[100],
        }}
      >
        <Typography component="p" color="text.secondary">
          {t('application:CONFERENCE.ATTACHMENTS.FILE_ATTACHMENTS')}
        </Typography>
        <Box
          onClick={handleOnClose}
          sx={{
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </Box>
      </Box>
      {!data?.data?.length ? (
        <Box p={2}>
          <Typography component="p" color="text.secondary">
            {t('application:CONFERENCE.ATTACHMENTS.NO_ATTACHMENTS_AVAILABLE')}
          </Typography>
        </Box>
      ) : (
        <Box verticalFill horizontalAlign="center">
          {data?.data.map((item) => (
            <Box
              key={item.file}
              display="flex"
              alignItems="center"
              gap={1}
              mb={0.2}
              sx={{
                padding: 1,
                background: (theme) => theme.palette.primary[100],
              }}
            >
              <File size={20} />
              <Tooltip title={item.file}>
                <Typography
                  variant="body1"
                  color="secondary"
                  width={300}
                  noWrap
                >
                  {item.file}
                </Typography>
              </Tooltip>
              <Box
                sx={{
                  svg: {
                    color: (theme) => theme.palette.primary.main,
                    cursor: 'pointer',
                  },
                }}
              >
                <Download
                  onClick={() => {
                    void handleDownloadAttachment(item)
                  }}
                  size={20}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default WebinarAttachments
