import { Box, Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react'

import ModalBox from '../../../../../shared/components/ui-elements/modal-box'

const TextInputModal = forwardRef(({ onAddText }, ref) => {
  const [textInput, setTextInput] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [textObject, setTextObject] = useState(null)
  const modalRef = useRef(null)

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.openModal(),
    closeModal: () => modalRef.current?.closeModal(),
    setTextInput,
    setIsEditing,
    setTextObject,
    get isEditing() {
      return isEditing
    },
    get textObject() {
      return textObject
    },
  }))

  const handleSubmit = useCallback(() => {
    if (textInput.trim()) {
      onAddText(textInput, isEditing, textObject)
      modalRef.current?.closeModal()
      setTextInput('')
      setIsEditing(false)
      setTextObject(null)
    }
  }, [textInput, isEditing, textObject, onAddText])

  const handleClose = useCallback(() => {
    setTextInput('')
    setIsEditing(false)
    setTextObject(null)
  }, [])

  return (
    <ModalBox
      ref={modalRef}
      title={isEditing ? 'Edit Text' : 'Add Text'}
      size="md"
      onCloseModal={handleClose}
    >
      <TextField
        fullWidth
        multiline
        rows={3}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter your text here..."
        sx={{
          mb: 3,
        }}
      />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => {
            modalRef.current?.closeModal()
            handleClose()
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!textInput.trim()}>
          {isEditing ? 'Update' : 'Add'} Text
        </Button>
      </Box>
    </ModalBox>
  )
})

TextInputModal.displayName = 'TextInputModal'

TextInputModal.propTypes = {
  onAddText: PropTypes.func.isRequired,
}

export default TextInputModal
