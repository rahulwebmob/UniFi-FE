import { Box, Button, TextField, FormLabel, Typography, FormHelperText } from '@mui/material'
import { X, XCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const DeclineApplicant = ({ onDelete, onClose }) => {
  const [declinationReason, setDeclinationReason] = useState(null)
  const [showError, setShowError] = useState(false)

  return (
    <Box>
      <Typography variant="h6">Confirm</Typography>
      <Typography variant="body1">Are you sure you want to decline this application?</Typography>
      <Box mt={2}>
        <FormLabel>Please specify the reason:</FormLabel>
        <TextField
          variant="outlined"
          placeholder="Enter text..."
          fullWidth
          onChange={(e) => {
            setDeclinationReason(e.target.value.trim())
            if (e.target.value && e.target.value.trim() !== '') {
              setShowError(false)
            }
          }}
        />
        {showError && (
          <FormHelperText>
            <Typography variant="caption" color="error">
              Field is Required
            </Typography>
          </FormHelperText>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" mt={4} gap={2}>
        <Button
          fullWidth
          color="secondary"
          onClick={onClose}
          variant="contained"
          startIcon={<X size={18} />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => {
            if (declinationReason?.trim()) {
              onDelete(declinationReason)
            } else {
              setShowError(true)
            }
          }}
          startIcon={<XCircle size={18} />}
        >
          Decline
        </Button>
      </Box>
    </Box>
  )
}

DeclineApplicant.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default DeclineApplicant
