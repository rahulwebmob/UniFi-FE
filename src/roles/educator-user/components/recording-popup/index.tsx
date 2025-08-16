import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cast, Circle, XCircle } from 'lucide-react'

import { Box, Paper, Button, Typography, IconButton } from '@mui/material'

const RecordingPopup = ({ handleOnClose, handleToggleRecording }) => {
  const { t } = useTranslation('education')

  return (
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
        <Typography variant="subtitle1" fontWeight="bold">
          {t('EDUCATOR.RECORDING_POPUP.TITLE')}
        </Typography>
        <Typography variant="body2" color="grey.400">
          {t('EDUCATOR.RECORDING_POPUP.SUBTITLE')}
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
        {t('EDUCATOR.RECORDING_POPUP.START_BUTTON')}
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
}

export default RecordingPopup
