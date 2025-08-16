import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import React, { useRef, useEffect } from 'react'

import { Box, Button, IconButton, Typography } from '@mui/material'

import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'

const DeleteModal = ({
  handleDelete,
  message,
  isDisabled,
  forceOpen,
  onClose,
}) => {
  const { t } = useTranslation('education')
  const deleteRef = useRef(null)

  useEffect(() => {
    if (forceOpen && deleteRef.current) {
      deleteRef.current.openModal()
    }
  }, [forceOpen])

  const handleClose = () => {
    deleteRef.current?.closeModal()
    if (onClose) onClose()
  }

  const handleConfirm = () => {
    handleDelete()
    handleClose()
  }

  return (
    <>
      {!forceOpen && (
        <IconButton
          color="error"
          disabled={isDisabled}
          onClick={() => deleteRef.current.openModal()}
        >
          <X size={20} />
        </IconButton>
      )}
      <ModalBox ref={deleteRef} onCloseModal={onClose}>
        <Box p={2}>
          <Typography component="p" mb={3} maxWidth={350}>
            {t('EDUCATOR.DELETE_MODAL.CONFIRM_DELETE_MSG', {
              message,
            })}
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <Button
              onClick={handleConfirm}
              size="small"
              variant="contained"
              color="secondary"
            >
              {t('EDUCATOR.DELETE_MODAL.YES')}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              {t('EDUCATOR.DELETE_MODAL.CANCEL')}
            </Button>
          </Box>
        </Box>
      </ModalBox>
    </>
  )
}

export default DeleteModal
