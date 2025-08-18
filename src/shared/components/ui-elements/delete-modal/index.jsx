import { useTranslation } from 'react-i18next'

import { Box, Button, useTheme, Typography } from '@mui/material'

const DeleteModal = ({
  selectedValue = '',
  submit,
  closeModal,
  isSubmitting = false,
  deleteText = '',
}) => {
  const { t } = useTranslation('application')
  const theme = useTheme()

  return (
    <Box>
      <Typography variant="h6">
        {deleteText || t('application:CORE.DELETE_MODAL.DESC')}
      </Typography>
      <Typography
        variant="body2"
        fontStyle="italic"
        sx={{ color: theme.palette.primary.main, maxWidth: '350px' }}
      >
        {selectedValue}
      </Typography>

      <Box display="flex" mt={1} justifyContent="flex-end" gap="10px">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => submit()}
          disabled={isSubmitting}
        >
          {t('application:CORE.DELETE_MODAL.YES')}
        </Button>
        <Button
          size="small"
          sx={{ ml: 1 }}
          variant="contained"
          onClick={() => closeModal()}
        >
          {t('application:CORE.DELETE_MODAL.NO')}
        </Button>
      </Box>
    </Box>
  )
}

export default DeleteModal
