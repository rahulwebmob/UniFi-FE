import { Box, Skeleton, alpha, useTheme } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import timeperiod from '../../../../../constants/timeperiod'
import { useGetActiveUsersQuery } from '../../../../../services/admin'

import TimeFilter from './TimeFilter'

const ActiveUsersChart = () => {
  const theme = useTheme()
  const [timeFilter, setTimeFilter] = useState('weekly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const { data, isLoading, error } = useGetActiveUsersQuery({
    timePeriod: timeFilter,
    targetMonth: selectedMonth,
    targetYear: new Date().getFullYear(),
  })

  const handleFilterChange = ({ filter, month }) => {
    setTimeFilter(filter)
    setSelectedMonth(month)
  }

  const getTimePeriod = (id, selectedTimePeriod) => {
    if (selectedTimePeriod === 'yearly') {
      return `${new Date().getFullYear()}`
    }
    if (selectedTimePeriod === 'monthly') {
      return timeperiod.monthly[id] || ''
    }
    if (selectedTimePeriod === 'weekly') {
      return timeperiod.weekly[id] || ''
    }
    return ''
  }

  const chartOption = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return null
    }

    const xAxisData = data.data.map((item) => getTimePeriod(item._id, timeFilter))
    const seriesData = data.data.map((item) => item.totalActiveUsersCount)

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        textStyle: {
          color: theme.palette.text.primary,
          fontSize: 13,
        },
        formatter: (params) => {
          const { value, name } = params[0]
          return `
            <div style="font-weight: 600; margin-bottom: 8px; color: ${theme.palette.text.primary}">
              ${name}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 12px; height: 12px; 
                background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}); 
                border-radius: 3px;">
              </span>
              <span style="color: ${theme.palette.text.secondary}">Active Users:</span>
              <span style="font-weight: 600; color: ${theme.palette.text.primary}">
                ${value.toLocaleString()}
              </span>
            </div>
          `
        },
      },
      grid: {
        top: '5%',
        left: '2%',
        right: '2%',
        bottom: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.3),
            width: 1,
          },
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          fontSize: 11,
          rotate: timeFilter === 'monthly' ? 45 : 0,
          margin: 12,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          fontSize: 11,
          formatter: (value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`
            }
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`
            }
            return value
          },
        },
        splitLine: {
          lineStyle: {
            color: alpha(theme.palette.divider, 0.15),
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: 'Active Users',
          type: 'bar',
          data: seriesData,
          barWidth: '50%',
          barMaxWidth: 40,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: theme.palette.primary.light },
                { offset: 1, color: theme.palette.primary.main },
              ],
            },
            borderRadius: [6, 6, 0, 0],
            shadowColor: alpha(theme.palette.primary.main, 0.2),
            shadowBlur: 8,
            shadowOffsetY: 2,
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: theme.palette.primary.main },
                  { offset: 1, color: theme.palette.primary.dark },
                ],
              },
              shadowColor: alpha(theme.palette.primary.main, 0.4),
              shadowBlur: 12,
              shadowOffsetY: 4,
            },
          },
          animationDuration: 1500,
          animationEasing: 'elasticOut',
          animationDelay: (idx) => idx * 100,
        },
      ],
    }
  }, [data, timeFilter, theme])

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          color: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          borderRadius: 2,
        }}
      >
        Error loading chart data. Please try again later.
      </Box>
    )
  }

  return (
    <Box>
      <TimeFilter onFilterChange={handleFilterChange} />
      <Box sx={{ mt: 3, minHeight: 400 }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          />
        ) : chartOption ? (
          <ReactECharts
            option={chartOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
              borderRadius: 2,
            }}
          >
            No data available for the selected period
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ActiveUsersChart
