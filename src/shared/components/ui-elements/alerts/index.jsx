import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, XCircle, CheckCircle } from 'lucide-react'

import { Box, Slide, Stack, Snackbar, Typography } from '@mui/material'

import { removeAlert } from '../../../../redux/reducers/app-slice'

const CustomTransition = React.forwardRef(function CustomTransition(props, ref) {
  return (
    <Slide
      {...props}
      ref={ref}
      direction="left"
      style={{
        transitionTimingFunction: props.in
          ? 'cubic-bezier(0.4, 0, 0.2, 1)'
          : 'cubic-bezier(0.4, 0, 0.6, 1)',
      }}
    />
  )
})

const GenericAlert = ({ alert }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(true)

  const handleClose = (
    _event,
    reason,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleExited = () => {
    dispatch(removeAlert())
  }

  return (
    <Snackbar
      key={alert.key}
      open={open}
      onClose={handleClose}
      TransitionComponent={CustomTransition}
      TransitionProps={{
        onExited: handleExited,
        timeout: {
          enter: 400,
          exit: 400,
        },
      }}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          animation: 'fadeIn 0.4s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.9) translateX(50px)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1) translateX(0)',
            },
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(-5px)',
            boxShadow: (theme) => `0 8px 16px ${theme.palette.action.hover}`,
          },
        },
      }}
      message={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="text.primary"
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              '& svg': {
                color: (theme) =>
                  alert.severity === 'success'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                fontSize: 24,
                mr: 1,
                animation: 'iconPulse 0.5s ease-in-out',
                '@keyframes iconPulse': {
                  '0%': {
                    transform: 'scale(0)',
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                },
              },
            }}
          >
            {alert.severity === 'success' ? <CheckCircle /> : <XCircle />}
            <Typography component="p" p={0}>
              {alert.message}
            </Typography>
          </Box>
          <X
            style={{
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              fontSize: '20px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'rotate(0deg)')
            }
            onClick={() => setOpen(false)}
          />
        </Box>
      }
    />
  )
}

const FloatingAlerts = memo(() => {
  const alerts = useSelector((state) => state.app.alerts)

  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
        zIndex: 99,
        '& .MuiSnackbar-root': {
          '& .MuiPaper-root': {
            p: 1,
            borderRadius: '8px',
          },
        },
        '& .MuiSnackbarContent-message': {
          width: '100%',
          p: 0,
        },
        '& .MuiSnackbarContent-root': {
          background: (theme) => theme.palette.background.default,
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.action.hover}`,
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {alerts.map((alert) => (
        <GenericAlert key={alert.key} alert={alert} />
      ))}
    </Stack>
  )
})

export default FloatingAlerts
