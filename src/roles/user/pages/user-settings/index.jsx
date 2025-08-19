import {
  Box,
  Tab,
  Tabs,
  alpha,
  Button,
  Select,
  MenuItem,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { User, LogOut, Settings, CreditCard, Gift } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Logout from '../../../../shared/components/auth-wrapper/logout'
import UserSettings from '../../components/user-settings-tabs/user-app-settings'
import EducationPayments from '../../components/user-settings-tabs/user-payments'
import PersonalInfo from '../../components/user-settings-tabs/user-personal-info'
import Referrals from '../../components/user-settings-tabs/user-referrals'

const MyProfile = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const location = useLocation()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
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
    {
      key: 'USERSETTING',
      name: t('application:PROFILE.USER_SETTINGS'),
      icon: <Settings size={20} />,
      component: (
        <Box sx={{ padding: '12px' }}>
          <UserSettings />
        </Box>
      ),
      show: true,
    },
  ]

  useEffect(() => {
    // Check for tab query parameter
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')

    if (tabParam === 'payments') {
      // Set to index 1 for Education Payments tab
      setValue(1)
    } else {
      setValue(0)
    }
  }, [location.search])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          {t('application:PROFILE.MY')}&nbsp;
          {t('application:PROFILE.PROFILE')}
        </Typography>
        <Typography component="p" color="text.secondary">
          {t('application:PROFILE.MANAGE_INFO_DESCRIPTION')}
        </Typography>
      </Box>

      {matches && (
        <Select
          sx={{
            mb: 2,
            mt: 2,
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '& .MuiSvgIcon-root': {
                fontSize: '1.25rem',
                flexShrink: 0,
              },
            },
          }}
          fullWidth
          size="small"
          label={null}
          value={value}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {tabComponents[selected].icon}
              <span>{tabComponents[selected].name}</span>
            </Box>
          )}
        >
          {tabComponents.map(
            (item, index) =>
              item.show && (
                <MenuItem
                  key={item.key}
                  value={index}
                  onClick={() => handleChange(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    },
                  }}
                >
                  {item.icon} {item.name}
                </MenuItem>
              ),
          )}
        </Select>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: !matches ? '280px 1fr' : '1fr',
          gap: 2,
          minHeight: 'calc(100vh - 300px)', // Dynamic height based on viewport
        }}
      >
        <Box
          sx={{
            display: !matches ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.light,
            borderRadius: '12px',
            p: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: '100%', // Take full height of parent
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
                display: 'none', // Hide the indicator
              },
              '& .MuiTab-root': {
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'left',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 48,
                borderRadius: '8px',
                px: 2,
                py: 1.5,
                mb: 0.5,
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '& .MuiSvgIcon-root': {
                  color: theme.palette.text.secondary,
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
                  startIcon={<LogOut size={20} color={theme.palette.error.main} />}
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  {t('application:PROFILE.LOGOUT')}
                </Button>
              }
              type={undefined}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.light,
            borderRadius: '12px',
            overflow: 'auto', // Allow scrolling if content is long
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: '100%', // Take full height of parent
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            className="main-content"
            sx={{
              p: 3,
              flex: 1,
              overflow: 'auto', // Allow content scrolling
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
