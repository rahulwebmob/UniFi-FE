import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { useRef, useEffect, useCallback } from 'react'
import {
  Users,
  Video,
  PenTool,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Presentation,
} from 'lucide-react'

import {
  Box,
  Card,
  Grid,
  Chip,
  alpha,
  Paper,
  Button,
  useTheme,
  Container,
  Typography,
} from '@mui/material'

import { chatSocket, initializeSocket } from '../../../../services/sockets'

const Dashboard = () => {
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const theme = useTheme()

  const socketReconnection = useCallback(() => {
    window.clearTimeout(setTimeoutId.current)
    setTimeoutId.current = window.setTimeout(() => {
      const token = localStorage.getItem('token')
      if (token) initializeSocket(token, false)
    }, 3000)
  }, [])

  useEffect(() => {
    chatSocket?.on('connect', () => {
      window.clearTimeout(setTimeoutId.current)
    })
    chatSocket?.on('disconnect', () => {
      socketReconnection()
    })
    chatSocket?.on('connect_error', () => {
      socketReconnection()
    })

    return () => {
      window.clearTimeout(setTimeoutId.current)
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
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
        }}
      >
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'white',
            borderRadius: 3,
            boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
              transform: 'skewX(-15deg)',
              transformOrigin: 'top right',
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Welcome to Educator Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 400,
              mb: 3,
            }}
          >
            {t('EDUCATOR.DASHBOARD.SUB_HEADING_1')}
            {t('EDUCATOR.DASHBOARD.SUB_HEADING_2')}
          </Typography>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  p: 2,
                  background: alpha(theme.palette.success.main, 0.08),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                    }}
                  >
                    <TrendingUp size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Active Courses
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      0
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  p: 2,
                  background: alpha(theme.palette.info.main, 0.08),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}
                  >
                    <Users size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      0
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box
                sx={{
                  p: 2,
                  background: alpha(theme.palette.warning.main, 0.08),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                    }}
                  >
                    <Video size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Upcoming Webinars
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      0
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Cards */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: theme.palette.text.primary,
          }}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          {cardData.map((item) => {
            const Icon = item.icon
            return (
              <Grid size={{ xs: 12, md: 6 }} key={item.link}>
                <Card
                  sx={{
                    p: 0,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: `0 4px 20px ${alpha(item.color, 0.1)}`,
                    border: `1px solid ${alpha(item.color, 0.1)}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 30px ${alpha(item.color, 0.15)}`,
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
                    sx={{
                      height: 8,
                      background: item.gradient,
                    }}
                  />
                  <Box sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: alpha(item.color, 0.1),
                        color: item.color,
                        mb: 3,
                      }}
                    >
                      <Icon size={32} />
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t(item.title)}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.7,
                      }}
                    >
                      {t(item.description)}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={
                        <ArrowRight
                          size={20}
                          className="action-arrow"
                          style={{ transition: 'transform 0.3s' }}
                        />
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        background: item.gradient,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(item.color, 0.3)}`,
                        },
                      }}
                    >
                      {t(item.button)}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Recent Activity Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            background: 'white',
            borderRadius: 3,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.06)}`,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Recent Activity
            </Typography>
            <Chip
              label="Coming Soon"
              size="small"
              sx={{
                background: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 500,
              }}
            />
          </Box>

          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <BookOpen size={48} color={theme.palette.text.disabled} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              No recent activity to display
            </Typography>
            <Typography variant="caption">
              Start by creating your first course or webinar
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Dashboard
