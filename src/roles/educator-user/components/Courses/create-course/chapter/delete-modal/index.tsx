import React, { useRef } from 'react'
import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DeleteModalProps {
  handleDelete: () => void
  message?: string
  isDisabled?: boolean
}

interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ 
  handleDelete, 
  message = '', 
  isDisabled = false 
}) => {
  const { t } = useTranslation('education')
  const deleteRef = useRef<ModalBoxHandle>(null)
  
  return (
    <>
      <IconButton
        color="error"
        disabled={isDisabled}
        onClick={() => deleteRef.current?.openModal()}
      >
        <X size={20} />
      </IconButton>
      <ModalBox ref={deleteRef}>
        <Box p={2}>
          <Typography variant="body1" mb={3} maxWidth={350}>
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
              onClick={() => {
                handleDelete()
                deleteRef.current?.closeModal()
              }}
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
              onClick={() => deleteRef.current?.closeModal()}
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