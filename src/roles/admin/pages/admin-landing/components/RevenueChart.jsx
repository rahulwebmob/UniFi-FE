import { Box, Skeleton, alpha, useTheme } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import timeperiod from '../../../../../constants/timeperiod'
import { useGetRevenueDataQuery } from '../../../../../services/admin'

import TimeFilter from './TimeFilter'

const RevenueChart = () => {
  const theme = useTheme()
  const [timeFilter, setTimeFilter] = useState('weekly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const { data, isLoading, error } = useGetRevenueDataQuery({
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
    const seriesData = data.data.map((item) => item.totalRevenueAmount)

    const gradientColor =
      theme.palette.mode === 'dark'
        ? theme.palette.warning?.main || '#FFA726'
        : theme.palette.accent?.golden || '#FFD700'

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
                background: linear-gradient(135deg, ${gradientColor}, ${alpha(gradientColor, 0.7)}); 
                border-radius: 3px;">
              </span>
              <span style="color: ${theme.palette.text.secondary}">Revenue:</span>
              <span style="font-weight: 600; color: ${theme.palette.text.primary}">
                $${value.toLocaleString()}
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
        boundaryGap: false,
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
              return `$${(value / 1000000).toFixed(1)}M`
            }
            if (value >= 1000) {
              return `$${(value / 1000).toFixed(0)}k`
            }
            return `$${value}`
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
          name: 'Revenue',
          type: 'line',
          data: seriesData,
          smooth: 0.6,
          symbol: 'circle',
          symbolSize: 8,
          sampling: 'lttb',
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: gradientColor },
                { offset: 0.5, color: alpha(gradientColor, 0.8) },
                { offset: 1, color: theme.palette.warning?.main || '#FFA726' },
              ],
            },
            shadowColor: alpha(gradientColor, 0.3),
            shadowBlur: 10,
            shadowOffsetY: 4,
          },
          itemStyle: {
            color: gradientColor,
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: alpha(gradientColor, 0.5),
            shadowBlur: 10,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: alpha(gradientColor, 0.3) },
                { offset: 0.5, color: alpha(gradientColor, 0.15) },
                { offset: 1, color: alpha(gradientColor, 0.05) },
              ],
            },
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: theme.palette.warning?.main || '#FFA726',
              borderColor: theme.palette.warning?.main || '#FFA726',
              borderWidth: 3,
              shadowBlur: 20,
              shadowColor: alpha(gradientColor, 0.6),
            },
          },
          animationDuration: 2000,
          animationEasing: 'cubicInOut',
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
        Error loading revenue data. Please try again later.
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
              bgcolor: alpha(theme.palette.warning?.main || '#FFA726', 0.05),
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
            No revenue data available for the selected period
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default RevenueChart
