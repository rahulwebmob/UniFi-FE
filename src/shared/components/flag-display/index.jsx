import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const FlagDisplay = ({ countryCode, size = 24 }) => {
  if (!countryCode) return null
  
  const flagUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`

  return (
    <Box
      component="img"
      src={flagUrl}
      alt={`${countryCode} flag`}
      sx={{
        width: size,
        height: size * 0.75,
        objectFit: 'contain',
        borderRadius: '2px',
        display: 'inline-block',
      }}
      onError={(e) => {
        e.target.style.display = 'none'
      }}
    />
  )
}

FlagDisplay.propTypes = {
  countryCode: PropTypes.string,
  size: PropTypes.number,
}

export default FlagDisplay