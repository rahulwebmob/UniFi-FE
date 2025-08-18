import { useState } from 'react'

import { Box, Button, Typography, ButtonGroup } from '@mui/material'

import CourseList from '../course-list'
import WebinarList from '../webinar-list'

const PurchasedContent: React.FC = () => {
  const [contentType, setContentType] = useState('course')

  return (
    <Box
      sx={{
        mb: 4,
        position: 'relative',
        px: { xs: 2, sm: 3, md: 5 },
        py: 2,
        backgroundColor: (theme) => theme.palette.background.light,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Purchased content
        </Typography>

        <ButtonGroup size="small" variant="contained">
          <Button
            onClick={() => setContentType('course')}
            variant={contentType === 'course' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
            }}
          >
            Courses
          </Button>
          <Button
            onClick={() => setContentType('webinar')}
            variant={contentType === 'webinar' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
            }}
          >
            Webinars
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          position: 'relative',
          borderBottom: 'none',
          '& .MuiCard-root': {
            borderBottom: 'none !important',
          },
          '& .MuiTabs-scroller': {
            whiteSpace: 'wrap',
          },
          '& .MuiTabs-flexContainer': {
            gap: '10px',
          },
          '& .MuiTabs-scrollButtons': {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            '&:first-of-type': {
              left: -40,
            },
            '&:last-of-type': {
              right: -40,
            },
          },
          '& .MuiButtonBase-root': {
            backgroundColor: (theme) => theme.palette.primary.main,
            borderRadius: '50%',
            width: 32,
            height: 32,
            minWidth: 32,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            '& svg': {
              fill: 'white',
              width: 16,
              height: 16,
            },
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
            '&.Mui-disabled': {
              opacity: 0.3,
              backgroundColor: (theme) => theme.palette.grey[300],
            },
          },
        }}
      >
        {contentType === 'course' ? (
          <CourseList isPurchased page={1} />
        ) : (
          <WebinarList isPurchased page={1} />
        )}
      </Box>
    </Box>
  )
}

export default PurchasedContent
