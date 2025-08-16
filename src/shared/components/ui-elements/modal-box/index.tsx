import type { ReactNode } from 'react';

import { X } from 'lucide-react'
// import { useSelector } from 'react-redux' // Uncomment if selector is needed
import React, { forwardRef, useImperativeHandle } from 'react'

import {
  Slide,
  Dialog,
  useTheme,
  IconButton,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from '@mui/material'


const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
))

interface ModalBoxProps {
  modalStyle?: object
  children: ReactNode
  title?: string
  size?: string
  onCloseModal?: (() => void) | null
  noWidth?: boolean
  fullScreen?: boolean
  disablePadding?: boolean
}

const ModalBox = forwardRef<{ open: () => void; close: () => void }, ModalBoxProps>(
  (
    {
      modalStyle = {},
      children,
      title = '',
      size = '',
      onCloseModal = null,
      noWidth = true,
      fullScreen = false,
      disablePadding = false,
    },
    ref,
  ) => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const [open, setOpen] = React.useState(false)
    // const { direction } = useSelector((state) => state.app.language) // Uncomment if direction is needed

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      openModal() {
        setOpen(true)
      },
      closeModal() {
        setOpen(false)
      },
    }))

    const iff = (condition, then, otherwise) => (condition ? then : otherwise)

    return (
      open && (
        <Dialog
          fullScreen={fullScreen}
          TransitionComponent={fullScreen ? Transition : 'Fade'}
          open={open}
          maxWidth={size}
          scroll="paper"
          PaperProps={{
            style: {
              ...modalStyle,
              overflow: 'unset',
              border: `1px solid ${theme.palette.grey[300]}`,
              backgroundColor:
                theme.palette.mode === 'light'
                  ? '#fff'
                  : theme.palette.background.default,
              width: size && noWidth ? '100%' : '',
              backgroundImage: 'initial',
              borderRadius: '16px',
              '& .MuiDialogContent-root': {
                padding: disablePadding ? 0 : '40px',
              },
            },
          }}
          sx={{
            '& .MuiDialog-paperFullScreen': {
              '& .MuiDialogContent-root': {
                padding: iff(disablePadding, 0, matches ? '20px' : '40px'),
              },
            },
          }}
        >
          {title && <DialogTitle sx={{ p: 3 }}>{title}</DialogTitle>}
          <IconButton
            disableRipple
            size="small"
            aria-label="close"
            onClick={() => {
              if (onCloseModal) onCloseModal()
              else setOpen(false)
            }}
            sx={{
              position: 'absolute',
              right: matches ? 5 : 0,
              top: matches ? 5 : 0,
              zIndex: 1,
              left: 'auto',
            }}
          >
            <X />
          </IconButton>
          <DialogContent
            sx={{
              p: disablePadding ? 0 : null,
              pl: disablePadding ? 0 : 3,
              pr: disablePadding ? 0 : 3,
            }}
          >
            {children}
          </DialogContent>
        </Dialog>
      )
    )
  },
)

export default ModalBox