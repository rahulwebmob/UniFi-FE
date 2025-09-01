import { Box, Card, MenuItem, TextField, Typography, alpha, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

const ChartCard = ({
  title,
  subtitle,
  children,
  actions,
  selectValue,
  onSelectChange,
  selectOptions,
}) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        p: 3,
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.25rem',
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {selectOptions && (
            <TextField
              select
              value={selectValue}
              onChange={onSelectChange}
              size="small"
              variant="outlined"
              sx={{
                minWidth: 180,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                },
              }}
            >
              {selectOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.icon}
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
          {actions}
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Card>
  )
}

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  selectValue: PropTypes.string,
  onSelectChange: PropTypes.func,
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    }),
  ),
}

ChartCard.defaultProps = {
  subtitle: null,
  actions: null,
  selectValue: null,
  onSelectChange: null,
  selectOptions: null,
}

export default ChartCard
