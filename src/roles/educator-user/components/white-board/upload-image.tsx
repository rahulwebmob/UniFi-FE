import React from 'react'
import * as fabric from 'fabric'
import { Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { IconButton } from '@mui/material'

import type { RootState } from '../../../../redux/types'
import { errorAlert } from '../../../../redux/reducers/app-slice'

const UploadImage: React.FC = () => {
  const dispatch = useDispatch()
  const canvasId = useSelector(
    (state: RootState) => state.education.canvasId as string | null,
  )
  
  // Get fabric canvas instance from global scope or create one
  const getFabricCanvas = (): fabric.Canvas | null => {
    if (!canvasId) return null
    const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvasElement) return null
    // Assume fabric canvas is already initialized elsewhere
    return (window as { __fabric_canvas__?: fabric.Canvas }).__fabric_canvas__ || null
  }

  const checkFile = (file: File): string => {
    if (file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return 'File size exceeds 5MB limit.'
      }
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedFormats.includes(file.type)) {
        return 'Please select a valid image file.'
      }
      return ''
    }
    return ''
  }

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const canvas = getFabricCanvas()
    if (!canvas) {
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    const err = checkFile(file)
    if (err) {
      dispatch(errorAlert({ message: err }))
      return
    }

    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const image = new Image()
      image.src = event.target?.result as string
      image.onload = () => {
        const fabricImage = new fabric.Image(image)

        fabricImage.scaleToWidth(150)
        fabricImage.scaleToHeight(150)

        const canvasCenter = canvas.getCenterPoint()
        fabricImage.set({
          left: canvasCenter.x,
          top: canvasCenter.y,
          originX: 'center',
          originY: 'center',
        })

        canvas.add(fabricImage)
        canvas.setActiveObject(fabricImage)
        canvas.renderAll()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <IconButton component="label">
      <Upload size={24} />
      <input
        type="file"
        hidden
        accept=".jpg, .jpeg, .png"
        onChange={onImageChange}
      />
    </IconButton>
  )
}

export default UploadImage
