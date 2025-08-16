import { Typography } from '@mui/material'

const RequiredFieldIndicator = () => (
  <Typography
    variant="body1"
    className="star"
    component="span"
    position="relative"
  >
    <Typography
      component="span"
      sx={{
        position: 'absolute',
        fontSize: '1.5em',
        color: 'error.main',
        top: '-7px',
      }}
    >
      *
    </Typography>
  </Typography>
)

export default RequiredFieldIndicator
