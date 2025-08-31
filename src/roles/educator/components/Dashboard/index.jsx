import { Box, Grid, Paper, Button, useTheme, Container, Typography } from '@mui/material'
import { PenTool, ArrowRight, Presentation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const cardData = [
    {
      icon: PenTool,
      title: 'Create a Course',
      description: 'Design and share your knowledge through structured courses',
      button: 'Create Course',
      link: 'create-course',
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    {
      icon: Presentation,
      title: 'Create a Webinar',
      description: 'Host live sessions and interact with your students',
      button: 'Create Webinar',
      link: 'create-webinar',
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
          }}
        >
          Welcome to Educator Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start creating engaging educational content and share your expertise with students
          worldwide.
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.light,
          boxShadow: (theme) => theme.customShadows.primary,
        }}
      >
        {cardData.map((item) => {
          const Icon = item.icon
          return (
            <Grid size={{ xs: 12, md: 6 }} key={item.link}>
              <Paper
                sx={{
                  p: 3,
                  background: theme.palette.background.paper,
                  cursor: 'pointer',
                  '&:hover': {
                    '& .action-arrow': {
                      transform: 'translateX(4px)',
                    },
                  },
                }}
                onClick={() => {
                  navigate(item.link)
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      mb: 2,
                    }}
                  >
                    <Icon size={50} />
                  </Box>
                  <Box textAlign="center">
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 0.5,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>

                <Button variant="contained" fullWidth endIcon={<ArrowRight size={18} />}>
                  {item.button}
                </Button>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

Dashboard.propTypes = {}

export default Dashboard
