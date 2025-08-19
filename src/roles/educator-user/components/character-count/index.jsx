import { Typography } from '@mui/material'
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

export default CharacterCount
