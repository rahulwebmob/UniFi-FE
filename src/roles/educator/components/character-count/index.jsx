import { Typography } from '@mui/material'
import PropTypes from 'prop-types'

const CharacterCount = ({ maxLength, currentLength }) => {
  const remainingCharacters = maxLength - currentLength

  return (
    <Typography variant="body2" component="span" color="text.secondary">
      Characters left :{remainingCharacters > 0 ? remainingCharacters : 0}
    </Typography>
  )
}

CharacterCount.propTypes = {
  maxLength: PropTypes.number.isRequired,
  currentLength: PropTypes.number.isRequired,
}

export default CharacterCount
