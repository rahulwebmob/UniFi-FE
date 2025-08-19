import { Box, Typography } from '@mui/material'
import { Beaker } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { useViewTutorDetailQuery } from '../../../../../services/admin'

const Achievements = () => {
  const { id } = useParams()
  const { data: tutorDetails } = useViewTutorDetailQuery(
    {
      educatorId: id || '',
    },
    {
      skip: !id,
    },
  )

  const educationData = tutorDetails?.data?.education ?? []
  const certificationData = tutorDetails?.data?.certifications ?? []

  return (
    <Box>
      <Typography component="p" mb={2} display="block">
        Education Qualification
      </Typography>
      {educationData.length ? (
        <Box
          display="flex"
          gap="10px"
          sx={{
            '& .course': {
              background: (theme) => theme.palette.primary.light,
              width: '100%',
              p: 2,
              borderRadius: '12px',
              maxWidth: '450px',
            },
          }}
        >
          {educationData.map((education, index) => (
            <Box
              key={education._id || `education-${education.degree}-${education.field}-${index}`}
              className="course"
            >
              <Box display="flex">
                <Beaker size={48} />
                <Box ml={1}>
                  <Typography component="p" fontWeight={600}>
                    {education.degree ?? '-'}
                  </Typography>
                  <Typography variant="body1">{education.field ?? '-'}</Typography>
                </Box>
              </Box>
              <Box />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No educational qualifications available.
        </Typography>
      )}

      <Box mt={2}>
        <Typography component="p" mb={1} display="block">
          Certifications
        </Typography>
        {certificationData.length ? (
          <Box
            display="flex"
            gap="10px"
            sx={{
              '& .course': {
                background: (theme) => theme.palette.primary.light,
                width: '100%',
                p: 2,
                borderRadius: '12px',
                maxWidth: '450px',
              },
            }}
          >
            {certificationData.map((certificate, index) => (
              <Box
                key={
                  certificate._id ||
                  `certificate-${certificate.name}-${certificate.organization}-${index}`
                }
                className="course"
              >
                <Box display="flex">
                  <Beaker size={48} />
                  <Box ml={1}>
                    <Typography component="p" fontWeight={600}>
                      {certificate.name ?? '-'}
                    </Typography>
                    <Typography variant="body1">{certificate.organization ?? '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No certifications available.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// No props to validate for this component
Achievements.propTypes = {}

export default Achievements
