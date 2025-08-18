import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useCallback } from 'react'
import { PenTool, ArrowRight, Presentation } from 'lucide-react'

import {
  Box,
  Grid,
  alpha,
  Paper,
  Button,
  useTheme,
  Container,
  Typography,
} from '@mui/material'

import { chatSocket, initializeSocket } from '../../../../services/sockets'

const Dashboard = () => {
  const setTimeoutId = useRef(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const theme = useTheme()

  const socketReconnection = useCallback(() => {
    if (setTimeoutId.current) {
      window.clearTimeout(setTimeoutId.current)
    }
    setTimeoutId.current = window.setTimeout(() => {
      const token = localStorage.getItem('token')
      if (token) initializeSocket(token, false)
    }, 3000)
  }, [])

  useEffect(() => {
    chatSocket?.on('connect', () => {
      if (setTimeoutId.current) {
        window.clearTimeout(setTimeoutId.current)
      }
    })
    chatSocket?.on('disconnect', () => {
      socketReconnection()
    })
    chatSocket?.on('connect_error', () => {
      socketReconnection()
    })

    return () => {
      if (setTimeoutId.current) {
        window.clearTimeout(setTimeoutId.current)
      }
    }
  }, [socketReconnection])

  const cardData = [
    {
      icon: PenTool,
      title: 'EDUCATOR.DASHBOARD.CREATE_A_COURSE',
      description: 'EDUCATOR.DASHBOARD.COURSE_DESCRIPTION',
      button: 'EDUCATOR.DASHBOARD.CREATE_COURSE',
      link: 'create-course',
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    {
      icon: Presentation,
      title: 'EDUCATOR.DASHBOARD.CREATE_A_WEBINAR',
      description: 'EDUCATOR.DASHBOARD.WEBINAR_DESCRIPTION',
      button: 'EDUCATOR.DASHBOARD.CREATE_WEBINAR',
      link: 'create-webinar',
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Welcome to Educator Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('EDUCATOR.DASHBOARD.SUB_HEADING_1')}
            {t('EDUCATOR.DASHBOARD.SUB_HEADING_2')}
          </Typography>
        </Box>

        {/* Quick Actions Cards */}
        <Grid
          container
          spacing={3}
          sx={{ backgroundColor: 'background.light', p: 3 }}
        >
          {cardData.map((item) => {
            const Icon = item.icon
            return (
              <Grid size={{ xs: 12, md: 6 }} key={item.link}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .action-arrow': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                  onClick={() => {
                    void navigate(item.link)
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={3}
                  >
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
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {t(item.title)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        {t(item.description)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={
                      <ArrowRight
                        size={18}
                        className="action-arrow"
                        style={{ transition: 'transform 0.3s' }}
                      />
                    }
                  >
                    {t(item.button)}
                  </Button>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard
