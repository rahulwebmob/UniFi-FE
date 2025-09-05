import { Box, Tooltip, Typography } from '@mui/material'
import { X, File, Download } from 'lucide-react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { useGetWebinarAttachmentsQuery } from '../../../../services/admin'
import { useGetAttachmentsListQuery } from '../../../../services/education'

const WebinarAttachments = ({ handleOnClose, isHost }) => {
  const { roomId: webinarId } = useParams()

  const hostData = useGetWebinarAttachmentsQuery(
    { webinarId: webinarId || '' },
    { skip: !webinarId || !isHost },
  )

  const guestData = useGetAttachmentsListQuery(
    { webinarId: webinarId || '' },
    { skip: !webinarId || isHost },
  )

  const handleDownloadAttachment = async (value) => {
    const response = await fetch(value.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'file' in value ? value.file : value.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
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
          File Attachments
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
      {!(isHost ? hostData.data?.data?.length : guestData.data?.length) ? (
        <Box p={2}>
          <Typography component="p" color="text.secondary">
            No attachments available
          </Typography>
        </Box>
      ) : (
        <Box>
          {(isHost ? hostData.data?.data : guestData.data)?.map((item) => {
            const fileName = 'file' in item ? item.file : item.name
            const itemKey = 'file' in item ? item.file : item.id
            return (
              <Box
                key={itemKey}
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
                <Tooltip title={fileName}>
                  <Typography variant="body1" color="secondary" width={300} noWrap>
                    {fileName}
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
                      handleDownloadAttachment(item)
                    }}
                    size={20}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

WebinarAttachments.propTypes = {
  handleOnClose: PropTypes.func.isRequired,
  isHost: PropTypes.bool.isRequired,
}

export default WebinarAttachments
