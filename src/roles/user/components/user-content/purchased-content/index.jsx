import { Box, Button, Typography, ButtonGroup } from '@mui/material'
import { BookOpen, Presentation } from 'lucide-react'
import { useState } from 'react'

import CourseList from '../../user-courses/course-list'
import WebinarList from '../../user-webinars/webinar-list'

const PurchasedContent = () => {
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
            startIcon={<BookOpen size={16} />}
          >
            Courses
          </Button>
          <Button
            onClick={() => setContentType('webinar')}
            variant={contentType === 'webinar' ? 'contained' : 'outlined'}
            startIcon={<Presentation size={16} />}
          >
            Webinars
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          '& .MuiButtonBase-root': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
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
