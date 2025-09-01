import { Box, Container, Grid, Typography, alpha, useTheme } from '@mui/material'
import { Activity, DollarSign, TrendingUp, UserCheck, UserX, Users } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { useGetUsersCountQuery } from '../../../../services/admin'

import ActiveUsersChart from './components/ActiveUsersChart'
import ChartCard from './components/ChartCard'
import RevenueChart from './components/RevenueChart'
import StatsCard from './components/StatsCard'

const AdminLanding = () => {
  const theme = useTheme()
  const { data: userCount, isLoading } = useGetUsersCountQuery()
  const { name: privilegeName } = useSelector((state) => state.user.user.privilege)
  const [selectedChart, setSelectedChart] = useState('activeUsers')

  const hasFullAccess = privilegeName === 'all'

  const statsData = [
    {
      title: 'Total Users',
      value: userCount?.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: theme.palette.primary.main,
      subtitle: 'All registered users',
    },
    {
      title: 'Active Users',
      value: userCount?.activeUsers?.toLocaleString() || '0',
      icon: UserCheck,
      color: theme.palette.success.main,
      subtitle: 'Currently active',
    },
    {
      title: 'Inactive Users',
      value: userCount?.inactiveUsers?.toLocaleString() || '0',
      icon: UserX,
      color: theme.palette.warning.main,
      subtitle: 'Not active recently',
    },
    ...(hasFullAccess
      ? [
          {
            title: 'Total Revenue',
            value: `$${userCount?.totalRevenue?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: theme.palette.accent?.golden || '#FFD700',
            subtitle: 'Lifetime earnings',
          },
        ]
      : []),
  ]

  const chartOptions = [
    {
      value: 'activeUsers',
      label: 'Active Users',
      icon: <Activity size={16} />,
    },
    ...(hasFullAccess
      ? [
          {
            value: 'revenue',
            label: 'Revenue',
            icon: <TrendingUp size={16} />,
          },
        ]
      : []),
  ]

  const renderChart = () => {
    switch (selectedChart) {
      case 'activeUsers':
        return <ActiveUsersChart />
      case 'revenue':
        return <RevenueChart />
      default:
        return <ActiveUsersChart />
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.02)} 0%, 
          ${alpha(theme.palette.background.default, 1)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '1rem',
            }}
          >
            Monitor your platform&apos;s performance and key metrics in real-time
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat) => (
            <Grid item key={stat.title} size={{ xs: 12, sm: 6, md: hasFullAccess ? 3 : 4 }}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                subtitle={stat.subtitle}
                isLoading={isLoading}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item size={12}>
            <ChartCard
              title="Analytics & Trends"
              subtitle="Track user engagement and platform growth over time"
              selectValue={selectedChart}
              onSelectChange={(e) => setSelectedChart(e.target.value)}
              selectOptions={chartOptions}
            >
              {renderChart()}
            </ChartCard>
          </Grid>
        </Grid>

        {/* Quick Stats Summary */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Platform Health Status
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                Your platform is performing well with steady user growth and engagement.
                {hasFullAccess && ' Revenue metrics show positive trends across all segments.'}
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.success.main,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.7)}`,
                        },
                        '70%': {
                          boxShadow: `0 0 0 10px ${alpha(theme.palette.success.main, 0)}`,
                        },
                        '100%': {
                          boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}`,
                        },
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    All Systems Operational
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminLanding
