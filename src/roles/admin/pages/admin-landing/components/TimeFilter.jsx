import {
  Box,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from '@mui/material'
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import timeperiod from '../../../../../constants/timeperiod'

const TimeFilter = ({ onFilterChange, showMonthSelector = true }) => {
  const theme = useTheme()
  const [selectedFilter, setSelectedFilter] = useState('weekly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setSelectedFilter(newFilter)
      onFilterChange({ filter: newFilter, month: selectedMonth })
    }
  }

  const handleMonthChange = (event) => {
    const newMonth = event.target.value
    setSelectedMonth(newMonth)
    onFilterChange({ filter: selectedFilter, month: newMonth })
  }

  const filterOptions = [
    { value: 'weekly', label: 'Weekly', icon: <Calendar size={16} /> },
    { value: 'monthly', label: 'Monthly', icon: <CalendarDays size={16} /> },
    { value: 'yearly', label: 'Yearly', icon: <CalendarRange size={16} /> },
  ]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <ToggleButtonGroup
        value={selectedFilter}
        exclusive
        onChange={handleFilterChange}
        size="small"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 1.5,
          '& .MuiToggleButton-root': {
            px: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            gap: 0.5,
            border: 'none',
            borderRadius: 1.5,
            color: theme.palette.text.secondary,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        }}
      >
        {filterOptions.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.icon}
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {showMonthSelector && selectedFilter === 'weekly' && (
        <TextField
          select
          value={selectedMonth}
          onChange={handleMonthChange}
          size="small"
          variant="outlined"
          label="Month"
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1.5,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        >
          {Object.entries(timeperiod.monthly).map(([key, value]) => (
            <MenuItem key={key} value={Number(key)}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      )}

      {selectedFilter === 'monthly' && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 1.5,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {new Date().getFullYear()}
        </Box>
      )}
    </Box>
  )
}

TimeFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  showMonthSelector: PropTypes.bool,
}

TimeFilter.defaultProps = {
  showMonthSelector: true,
}

export default TimeFilter
