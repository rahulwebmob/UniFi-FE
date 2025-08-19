import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const CharacterCount = ({ maxLength, currentLength }) => {
  const { t } = useTranslation('education')
  const remainingCharacters = maxLength - currentLength

  return (
    <Typography variant="body2" component="span" color="text.secondary">
      {t('EDUCATOR.BASIC_DETAILS.CHARACTERS_LEFT')} :
      {remainingCharacters > 0 ? remainingCharacters : 0}
    </Typography>
  )
}

CharacterCount.propTypes = {
  maxLength: PropTypes.number.isRequired,
  currentLength: PropTypes.number.isRequired,
}

export default CharacterCount
