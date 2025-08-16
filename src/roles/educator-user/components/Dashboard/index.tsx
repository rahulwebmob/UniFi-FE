import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PenTool, Presentation } from 'lucide-react'
import React, { useRef, useEffect, useCallback } from 'react'

import { Box, Container, Typography } from '@mui/material'

import { StyledCard, StyledButton, CardContainer } from './style'
import { chatSocket, initializeSocket } from '../../../../Services/sockets'

const Dashboard = () => {
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')

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
      icon: <PenTool size={55} />,
      title: 'EDUCATOR.DASHBOARD.CREATE_A_COURSE',
      description: 'EDUCATOR.DASHBOARD.COURSE_DESCRIPTION',
      button: 'EDUCATOR.DASHBOARD.CREATE_COURSE',
      link: 'create-course',
    },
    {
      icon: <Presentation size={55} />,
      title: 'EDUCATOR.DASHBOARD.CREATE_A_WEBINAR',
      description: 'EDUCATOR.DASHBOARD.WEBINAR_DESCRIPTION',
      button: 'EDUCATOR.DASHBOARD.CREATE_WEBINAR',
      link: 'create-webinar',
    },
  ]

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: (theme) => theme.palette.background.light,
          padding: 3,
        }}
      >
        <Box
          sx={{
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Educator Dashboard
          </Typography>
          <Typography component="p" color="text.secondary">
            {t('EDUCATOR.DASHBOARD.SUB_HEADING_1') +
              t('EDUCATOR.DASHBOARD.SUB_HEADING_2')}fi
          </Typography>
        </Box>
        <CardContainer>
          {cardData.map((item) => (
            <StyledCard key={item.link}>
              {item.icon}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t(item.title)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(item.description)}
              </Typography>

              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => {
                  void navigate(item.link)
                }}
              >
                {t(item.button)}
              </StyledButton>
            </StyledCard>
          ))}
        </CardContainer>
      </Container>
    </Box>
  )
}

export default Dashboard
