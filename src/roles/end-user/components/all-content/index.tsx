import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  TextField,
  Typography,
  ButtonGroup,
  Autocomplete,
} from '@mui/material'

import CourseList from '../course-list'
import WebinarList from '../webinar-list'
import { useGetCategoryListQuery } from '../../../../services/education'

const AllContent: React.FC = () => {
  const { t } = useTranslation('education')
  const [page, setPage] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [contentType, setContentType] = useState('course')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data } = useGetCategoryListQuery() as { data?: { data?: string[] } }

  const handleDebouceSearch = _.debounce((value: string) => {
    setPage(1)
    setSearchTerm(value || '')
  }, 700)

  const handleCategory = (value: string) => {
    setPage(1)
    setSelectedCategory(value || '')
  }

  const handleContentType = (value: string) => {
    setPage(1)
    setSearchTerm('')
    setContentType(value)
    setSelectedCategory('')
  }

  return (
    <Box
      sx={{
        position: 'relative',
        px: { xs: 2, sm: 3, md: 5 },
        py: 2,
        backgroundColor: (theme) => theme.palette.background.light,
        borderRadius: 1,
        mt: 3,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          mb: 2,
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            width: { xs: '100%', lg: 'auto' },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: (theme) => theme.palette.text.primary,
              whiteSpace: 'nowrap',
            }}
          >
            All content
          </Typography>
          {/* Tab Buttons */}
          <ButtonGroup size="small" variant="contained">
            <Button
              onClick={() => {
                if (contentType !== 'course') handleContentType('course')
              }}
              variant={contentType === 'course' ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none' }}
            >
              Courses
            </Button>
            <Button
              onClick={() => {
                if (contentType !== 'webinar') handleContentType('webinar')
              }}
              variant={contentType === 'webinar' ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none' }}
            >
              Webinars
            </Button>
          </ButtonGroup>
        </Box>
        {/* Filters Section */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
            alignItems: 'center',
          }}
        >
          <Autocomplete
            size="small"
            disablePortal
            options={data?.data ?? []}
            value={selectedCategory}
            getOptionLabel={(option) => option || ''}
            onChange={(__, newValue) => {
              handleCategory(newValue || '')
            }}
            sx={{
              width: { xs: '100%', sm: 220 },
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Categories" size="small" />
            )}
          />
          <TextField
            sx={{
              width: { xs: '100%', sm: 220 },
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
            size="small"
            placeholder={`Search ${contentType}...`}
            onChange={(e) => handleDebouceSearch(e.target.value)}
          />
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ position: 'relative' }}>
        {contentType === 'course' ? (
          <CourseList
            page={page}
            isPurchased={false}
            searchTerm={searchTerm}
            setIsLoadMore={setIsLoadMore}
            selectedCategory={selectedCategory}
          />
        ) : (
          <WebinarList
            page={page}
            isPurchased={false}
            searchTerm={searchTerm}
            setIsLoadMore={setIsLoadMore}
            selectedCategory={selectedCategory}
          />
        )}
      </Box>

      {!!isLoadMore && (
        <Typography
          variant="body2"
          component="p"
          sx={{
            mt: 2,
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'underline',
            color: 'primary.main',
            fontWeight: 500,
          }}
          onClick={() => setPage(page + 1)}
        >
          {t('EDUCATION_DASHBOARD.MAIN_PAGE.LOAD_MORE')}
        </Typography>
      )}
    </Box>
  )
}

export default AllContent
