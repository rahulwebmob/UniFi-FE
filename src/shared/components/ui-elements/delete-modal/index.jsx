import { Box, Button, useTheme, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const DeleteModal = ({
  selectedValue = '',
  submit,
  closeModal,
  isSubmitting = false,
  deleteText = '',
}) => {
  const theme = useTheme()

  return (
    <Box>
      <Typography variant="h6">{deleteText || 'Are you sure you want to delete?'}</Typography>
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
          Yes
        </Button>
        <Button size="small" sx={{ ml: 1 }} variant="contained" onClick={() => closeModal()}>
          No
        </Button>
      </Box>
    </Box>
  )
}

DeleteModal.propTypes = {
  selectedValue: PropTypes.string,
  submit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  deleteText: PropTypes.string,
}

export default DeleteModal
