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

  const handleDebouceSearch = _.debounce((value) => {
    setPage(1)
    setSearchTerm(value || '')
  }, 700)

  const handleCategory = (value) => {
    setPage(1)
    setSelectedCategory(value || '')
  }

  const handleContentType = (value) => {
    setPage(1)
    setSearchTerm('')
    setContentType(value)
    setSelectedCategory('')
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 5 },
        py: 2,
        backgroundColor: (theme) => theme.palette.background.light,
        borderRadius: 1,
        mt: 3,
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
            <Button
              onClick={() => {
                if (contentType !== 'course') {
                  handleContentType('course')
                }
              }}
              variant={contentType === 'course' ? 'contained' : 'outlined'}
              startIcon={<BookOpen size={16} />}
            >
              Courses
            </Button>
            <Button
              onClick={() => {
                if (contentType !== 'webinar') {
                  handleContentType('webinar')
                }
              }}
              variant={contentType === 'webinar' ? 'contained' : 'outlined'}
              startIcon={<Presentation size={16} />}
            >
              Webinars
            </Button>
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
            value={selectedCategory}
            getOptionLabel={(option) => option || ''}
            onChange={(__, newValue) => {
              handleCategory(newValue || '')
            }}
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
                      <InputAdornment
                        position="start"
                        sx={{ color: (theme) => theme.palette.text.disabled }}
                      >
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
            onChange={(e) => handleDebouceSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ color: (theme) => theme.palette.text.disabled }}
                >
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

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

      {!!isLoadMore && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, position: 'relative' }}>
          <Divider sx={{ flex: 1 }} />
          <Button color="secondary" variant="contained" onClick={() => setPage(page + 1)}>
            {t('EDUCATION_DASHBOARD.MAIN_PAGE.LOAD_MORE')}
          </Button>
          <Divider sx={{ flex: 1 }} />
        </Box>
      )}
    </Box>
  )
}

export default AllContent
