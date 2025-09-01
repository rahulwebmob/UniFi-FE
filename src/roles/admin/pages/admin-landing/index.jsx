import { Box, Grid, Typography, useTheme } from '@mui/material'
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
    <Box>
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Admin Users
          </Typography>
          <Typography color="text.secondary">
            Manage administrator accounts and privileges
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.light,
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
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
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLanding
