import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Box, Button, Divider, Tooltip, Typography } from '@mui/material'

import { useGetAllCoursesDetailsQuery } from '../../../../../../services/admin'
import PaginationComponent from '../../../../../../shared/components/ui-elements/pagination-component'

interface CourseDetail {
  _id: string
  thumbNail: string
  title: string
  description: string
  category: string[]
  price: number
  totalPurchased: number
}

interface CoursesResponse {
  data?: {
    courses: CourseDetail[]
    totalPages?: number
  }
}

const Courses = () => {
  const { id } = useParams()
  const [page, setPage] = useState(1)

  const { data: coursesDetails } = useGetAllCoursesDetailsQuery(
    {
      educatorId: id || '',
      page,
      pageSize: 10,
    },
    {
      skip: !id,
    },
  ) as { data: CoursesResponse | undefined }

  const coursesData: CourseDetail[] = coursesDetails?.data?.courses ?? []

  return (
    <Box>
      <Typography component="p" mt={2} mb={1} display="block">
        Courses
      </Typography>
      {coursesData.length ? (
        <Box
          display="flex"
          gap="10px"
          flexWrap="wrap"
          sx={{
            '& .award': {
              background: (theme) => theme.palette.primary.light,
              p: 2,
              borderRadius: '12px',
              width: '335px',
            },
          }}
        >
          {coursesData.map((coursesDetail) => (
            <Box className="award" key={coursesDetail._id}>
              <Box
                component="img"
                src={coursesDetail.thumbNail}
                alt="Description of the image"
                sx={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <Typography component="p" display="block" my={1}>
                {coursesDetail.title}
              </Typography>
              <Tooltip title={coursesDetail.description} arrow>
                <Typography
                  component="p"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordWrap: 'break-word',
                  }}
                  mb={2}
                >
                  {coursesDetail.description}
                </Typography>
              </Tooltip>
              <Box
                display="flex"
                justifyContent="space-between"
                my={1}
                gap="2px"
                flexWrap="wrap"
              >
                {coursesDetail.category?.map((category) => (
                  <Button
                    key={category}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  >
                    {category}
                  </Button>
                ))}
                <Typography component="p" color="primary.main">
                  at ${coursesDetail.price}
                </Typography>
              </Box>
              <Divider
                sx={{
                  my: 1,
                  borderColor: (theme) => theme.palette.grey[300],
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography
                  variant="body1"
                  component="i"
                  color="text.secondary"
                >
                  {coursesDetail.totalPurchased}{' '}
                  {coursesDetail.totalPurchased > 1 ? 'purchases' : 'purchase'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" mt={2}>
          No courses available.
        </Typography>
      )}

      {coursesData.length > 0 && (
        <PaginationComponent
          data={coursesDetails?.data}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  )
}

export default Courses
