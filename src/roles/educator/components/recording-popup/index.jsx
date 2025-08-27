import { Box, Paper, Button, Typography, IconButton } from '@mui/material'
import { Cast, Circle, XCircle } from 'lucide-react'
import PropTypes from 'prop-types'

const RecordingPopup = ({ handleOnClose, handleToggleRecording }) => (
  <Paper
    elevation={6}
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: (theme) => theme.palette.background.default,
      padding: 2,
      borderRadius: 2,
      position: 'absolute',
      top: 110,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1300,
      minWidth: 400,
      gap: 2,
    }}
  >
    <Box sx={{ svg: { fontSize: 40 } }}>
      <Cast size={40} />
    </Box>

    <Box flexGrow={1}>
      <Typography variant="subtitle1">Start Recording</Typography>
      <Typography variant="body2" color="grey.400">
        Click start to begin recording your session
      </Typography>
    </Box>

    <Button
      startIcon={<Circle size={16} />}
      sx={{
        '& .MuiButton-startIcon': {
          ml: 0,
        },
      }}
      color="error"
      variant="contained"
      onClick={() => {
        handleToggleRecording()
        handleOnClose()
      }}
    >
      Start
    </Button>

    <IconButton
      sx={{
        position: 'absolute',
        top: -10,
        right: -15,
      }}
      color="error"
      disableRipple
      onClick={handleOnClose}
    >
      <XCircle size={20} />
    </IconButton>
  </Paper>
)

RecordingPopup.propTypes = {
  handleOnClose: PropTypes.func.isRequired,
  handleToggleRecording: PropTypes.func.isRequired,
}

export default RecordingPopup
