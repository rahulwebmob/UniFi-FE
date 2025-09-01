import { Box, Card, Skeleton, Typography, alpha, useTheme } from '@mui/material'
import { TrendingDown, TrendingUp } from 'lucide-react'
import PropTypes from 'prop-types'

const StatsCard = ({ title, value, icon: Icon, color, trend, isLoading, subtitle }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
          color,
          0.02,
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.2),
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(color, 0.1)} 0%, transparent 70%)`,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: 1.5,
                mb: 1,
                display: 'block',
              }}
            >
              {title}
            </Typography>

            {isLoading ? (
              <Skeleton variant="text" width={100} height={40} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: '2rem',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.8rem',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
              boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
            }}
          >
            <Icon size={24} color="white" />
          </Box>
        </Box>

        {trend !== undefined && trend !== null && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(
                  trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                  0.1,
                ),
                color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
              }}
            >
              {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              vs last period
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  )
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.number,
  isLoading: PropTypes.bool,
  subtitle: PropTypes.string,
}

StatsCard.defaultProps = {
  trend: null,
  isLoading: false,
  subtitle: null,
}

export default StatsCard
