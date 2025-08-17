import type { ReactNode, CSSProperties } from 'react'
import type { TransitionProps } from '@mui/material/transitions'

import { X } from 'lucide-react'
import React, { useState, forwardRef, useImperativeHandle } from 'react'

import {
  Slide,
  Dialog,
  useTheme,
  IconButton,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  type Breakpoint,
} from '@mui/material'

const Transition = React.forwardRef<
  unknown,
  TransitionProps & {
    children: React.ReactElement
  }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />)

Transition.displayName = 'TransitionComponent'

export interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

interface ModalBoxProps {
  modalStyle?: CSSProperties
  children: ReactNode
  title?: string
  size?: Breakpoint | false
  onCloseModal?: (() => void) | null
  noWidth?: boolean
  fullScreen?: boolean
  disablePadding?: boolean
  isBackdropAllowed?: boolean
}

const ModalBox = forwardRef<ModalBoxHandle, ModalBoxProps>(
  (
    {
      modalStyle = {},
      children,
      title = '',
      size = 'sm',
      onCloseModal = null,
      noWidth = true,
      fullScreen = false,
      disablePadding = false,
    },
    ref,
  ) => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const [open, setOpen] = useState(false)

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      openModal() {
        setOpen(true)
      },
      closeModal() {
        setOpen(false)
      },
    }))

    const handleClose = () => {
      if (onCloseModal) {
        onCloseModal()
      } else {
        setOpen(false)
      }
    }

    if (!open) return null

    return (
      <Dialog
        fullScreen={fullScreen}
        TransitionComponent={fullScreen ? Transition : undefined}
        open={open}
        onClose={handleClose}
        maxWidth={size || undefined}
        scroll="paper"
        PaperProps={{
          sx: {
            ...modalStyle,
            overflow: 'visible',
            border: `1px solid ${theme.palette.grey[300]}`,
            backgroundColor:
              theme.palette.mode === 'light'
                ? '#fff'
                : theme.palette.background.default,
            width: size && noWidth ? '100%' : 'auto',
            backgroundImage: 'none',
            borderRadius: '16px',
            '& .MuiDialogContent-root': {
              padding: disablePadding ? 0 : '40px',
            },
          },
        }}
        sx={{
          '& .MuiDialog-paperFullScreen': {
            '& .MuiDialogContent-root': {
              padding: disablePadding ? 0 : matches ? '20px' : '40px',
            },
          },
        }}
      >
        {title && (
          <DialogTitle
            sx={{
              p: 3,
              pr: 6, // Add padding for close button
            }}
          >
            {title}
          </DialogTitle>
        )}

        <IconButton
          disableRipple
          size="small"
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: matches ? 12 : 16,
            top: matches ? 12 : 16,
            zIndex: 1,
            color: theme.palette.grey[500],
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <X size={20} />
        </IconButton>

        <DialogContent
          sx={{
            p: disablePadding ? 0 : 3,
            pt: title && !disablePadding ? 0 : undefined,
          }}
        >
          {children}
        </DialogContent>
      </Dialog>
    )
  },
)

ModalBox.displayName = 'ModalBox'

export default ModalBox
