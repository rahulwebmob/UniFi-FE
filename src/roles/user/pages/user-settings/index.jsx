import {
  Box,
  Tab,
  Tabs,
  alpha,
  Button,
  MenuItem,
  useTheme,
  Typography,
  useMediaQuery,
  TextField,
} from '@mui/material'
import { User, LogOut, CreditCard, Gift } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Logout from '../../../../shared/components/auth-wrapper/logout'
import EducationPayments from '../../components/user-settings-tabs/user-payments'
import PersonalInfo from '../../components/user-settings-tabs/user-personal-info'
import Referrals from '../../components/user-settings-tabs/user-referrals'

const MyProfile = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const location = useLocation()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const [value, setValue] = useState(0)

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  const tabComponents = [
    {
      key: 'PERSONALINFO',
      name: t('application:PROFILE.PERSONAL_INFO'),
      icon: <User size={20} />,
      component: <PersonalInfo />,
      show: true,
    },
    {
      key: 'EDUCATION',
      name: t('application:PROFILE.EDUCATION_PAYMENTS'),
      icon: <CreditCard size={20} />,
      component: <EducationPayments />,
      show: true,
    },
    {
      key: 'REFERRALS',
      name: 'Referrals',
      icon: <Gift size={20} />,
      component: <Referrals />,
      show: true,
    },
  ]

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')

    if (tabParam === 'payments') {
      setValue(1)
    } else {
      setValue(0)
    }
  }, [location.search])

  return (
    <Box width="100%">
      <Box mb={3}>
        <Typography variant="h4" mb={0.5}>
          My Profile
        </Typography>
        <Typography component="p" color="text.secondary">
          {t('application:PROFILE.MANAGE_INFO_DESCRIPTION')}
        </Typography>
      </Box>

      {isSm && (
        <TextField select fullWidth value={value} size="small" sx={{ mb: 2 }}>
          {tabComponents.map(
            (item, index) =>
              item.show && (
                <MenuItem key={item.key} value={index} onClick={() => handleChange(index)}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Box>
                </MenuItem>
              ),
          )}
        </TextField>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: !isSm ? '280px 1fr' : '1fr',
          gap: 2,
          minHeight: 'calc(100vh - 300px)',
        }}
      >
        <Box
          sx={{
            display: !isSm ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
            height: '100%',
            backgroundColor: theme.palette.background.light,
            borderRadius: 1.5,
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={(_, newValue) => handleChange(newValue)}
            aria-label="Profile navigation"
            sx={{
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                display: 'flex',
                textAlign: 'left',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 48,
                borderRadius: 1,
                px: 2,
                py: 1.5,
                mb: 0.5,
                color: 'text.primary',
                transition: 'all 0.2s ease',
                '& .MuiSvgIcon-root': {
                  color: 'text.secondary',
                  fontSize: '1.25rem',
                  mr: 1.5,
                  flexShrink: 0,
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.primary.dark,
                  },
                },
              },
            }}
          >
            {tabComponents.map(
              (item, index) =>
                item.show && (
                  <Tab
                    key={item.key}
                    icon={item.icon}
                    iconPosition="start"
                    value={index}
                    label={item.name}
                    sx={{
                      '& .MuiTab-wrapper': {
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      },
                    }}
                  />
                ),
            )}
          </Tabs>

          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Logout
              component={
                <Button
                  startIcon={<LogOut size={20} />}
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  {t('application:PROFILE.LOGOUT')}
                </Button>
              }
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.light,
            borderRadius: 1.5,
            overflow: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
          <Box
            sx={{
              p: 3,
              flex: 1,
              overflow: 'auto',
            }}
          >
            {tabComponents[value].component}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MyProfile
