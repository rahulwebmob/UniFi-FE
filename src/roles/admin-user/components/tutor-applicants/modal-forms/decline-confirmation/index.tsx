import { useState } from 'react'

import {
  Box,
  Button,
  TextField,
  FormLabel,
  Typography,
  FormHelperText,
} from '@mui/material'

interface DeclineConfirmationProps {
  onDelete: (reason: string) => void
  onClose: () => void
}

const DeclineConfirmation = ({
  onDelete,
  onClose,
}: DeclineConfirmationProps) => {
  const [declinationReason, setDeclinationReason] = useState<string | null>(
    null,
  )
  const [showError, setShowError] = useState(false)

  return (
    <Box>
      <Typography variant="h4">Confirm</Typography>
      <Typography variant="body1">
        Are you sure you want to decline this application?
      </Typography>
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
            <Typography fontSize="12px" color="error">
              Field is Required
            </Typography>
          </FormHelperText>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" mt={4} gap={2}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{ background: 'red' }}
          fullWidth
          onClick={() => {
            if (declinationReason?.trim()) {
              onDelete(declinationReason)
            } else {
              setShowError(true)
            }
          }}
        >
          Decline
        </Button>
      </Box>
    </Box>
  )
}

export default DeclineConfirmation
