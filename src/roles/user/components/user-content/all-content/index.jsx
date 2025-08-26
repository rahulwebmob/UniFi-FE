import {
  Box,
  Button,
  TextField,
  Typography,
  ButtonGroup,
  Autocomplete,
  Divider,
  InputAdornment,
} from '@mui/material'
import _ from 'lodash'
import { BookOpen, Presentation, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetCategoryListQuery } from '../../../../../services/education'
import CourseList from '../../user-courses/course-list'
import WebinarList from '../../user-webinars/webinar-list'

const AllContent = () => {
  const { t } = useTranslation('education')
  const [page, setPage] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [contentType, setContentType] = useState('course')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data } = useGetCategoryListQuery()

  const contentTypes = [
    {
      id: 'course',
      label: 'Courses',
      icon: BookOpen,
    },
    {
      id: 'webinar',
      label: 'Webinars',
      icon: Presentation,
    },
  ]

  const handleDebouncedSearch = _.debounce((value) => {
    setPage(1)
    setSearchTerm(value || '')
  }, 700)

  const handleCategoryChange = (value) => {
    setPage(1)
    setSelectedCategory(value || '')
  }

  const handleContentTypeChange = (value) => {
    setPage(1)
    setSearchTerm('')
    setContentType(value)
    setSelectedCategory('')
  }

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  const renderContentTypeButton = (type) => {
    const Icon = type.icon
    const isActive = contentType === type.id

    return (
      <Button
        key={type.id}
        onClick={() => {
          if (!isActive) {
            handleContentTypeChange(type.id)
          }
        }}
        variant={isActive ? 'contained' : 'outlined'}
        startIcon={<Icon size={16} />}
      >
        {type.label}
      </Button>
    )
  }

  const renderContentList = () => {
    const commonProps = {
      page,
      isPurchased: false,
      searchTerm,
      setIsLoadMore,
      selectedCategory,
    }

    return contentType === 'course' ? (
      <CourseList {...commonProps} />
    ) : (
      <WebinarList {...commonProps} />
    )
  }

  const renderLoadMoreButton = () => {
    if (!isLoadMore) {
      return null
    }

    return (
      <Box display="flex" alignItems="center" mt={3} position="relative">
        <Divider sx={{ flex: 1 }} />
        <Button color="secondary" variant="contained" onClick={handleLoadMore}>
          {t('EDUCATION_DASHBOARD.MAIN_PAGE.LOAD_MORE')}
        </Button>
        <Divider sx={{ flex: 1 }} />
      </Box>
    )
  }

  return (
    <Box
      px={{ xs: 2, sm: 3, md: 5 }}
      py={2}
      mt={3}
      sx={{
        backgroundColor: 'background.light',
        borderRadius: 1,
      }}
    >
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
          <Typography variant="h6">All content</Typography>
          <ButtonGroup size="small" variant="contained">
            {contentTypes.map(renderContentTypeButton)}
          </ButtonGroup>
        </Box>

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
            value={selectedCategory || null}
            getOptionLabel={(option) => option || ''}
            onChange={(__, newValue) => {
              handleCategoryChange(newValue || '')
            }}
            isOptionEqualToValue={(option, value) => option === value}
            sx={{
              width: { xs: '100%', sm: 220 },
              minWidth: 200,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Categories"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start" sx={{ color: 'text.disabled' }}>
                        <Filter size={18} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
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
            onChange={(e) => handleDebouncedSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.disabled' }}>
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {renderContentList()}
      {renderLoadMoreButton()}
    </Box>
  )
}

export default AllContent
