import { Beaker } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { Box, Typography } from '@mui/material'

import { useViewTutorDetailQuery } from '../../../../../../services/admin'

interface Education {
  degree: string
  field: string
  institution?: string
  startDate?: string
  endDate?: string
}

interface Certification {
  name: string
  organization: string
  link?: string
}

interface TutorDetailsResponse {
  data?: {
    education: Education[]
    certifications: Certification[]
  }
}

const Achievements = () => {
  const { id } = useParams()
  const { data: tutorDetails } = useViewTutorDetailQuery({
    educatorId: id,
  }) as { data: TutorDetailsResponse | undefined }

  const educationData: Education[] = tutorDetails?.data?.education ?? []
  const certificationData: Certification[] =
    tutorDetails?.data?.certifications ?? []

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
            <Box key={`${education.degree}-${index}`} className="course">
              <Box display="flex">
                <Beaker size={48} />
                <Box ml={1}>
                  <Typography component="p" fontWeight={600}>
                    {education.degree ?? '-'}
                  </Typography>
                  <Typography variant="body1">
                    {education.field ?? '-'}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1" color="text.secondary" mt={2}>
                  {education.year ?? '-'}
                </Typography>
              </Box>
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
              <Box key={`${certificate.degree}-${index}`} className="course">
                <Box display="flex">
                  <Beaker size={48} />
                  <Box ml={1}>
                    <Typography component="p" fontWeight={600}>
                      {certificate.name ?? '-'}
                    </Typography>
                    <Typography variant="body1">
                      {certificate.organization ?? '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    {certificate.year ?? '-'}
                  </Typography>
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

export default Achievements
