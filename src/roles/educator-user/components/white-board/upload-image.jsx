import { IconButton } from '@mui/material'
import * as fabric from 'fabric'
import { Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { errorAlert } from '../../../../redux/reducers/app-slice'

const UploadImage = () => {
  const dispatch = useDispatch()
  const canvasId = useSelector((state) => state.education.canvasId)

  // Get fabric canvas instance from global scope or create one
  const getFabricCanvas = () => {
    if (!canvasId) {
      return null
    }
    const canvasElement = document.getElementById(canvasId)
    if (!canvasElement) {
      return null
    }
    // Assume fabric canvas is already initialized elsewhere
    return window.__fabric_canvas__ || null
  }

  const checkFile = (file) => {
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

  const onImageChange = (e) => {
    const canvas = getFabricCanvas()
    if (!canvas) {
      return
    }

    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const err = checkFile(file)
    if (err) {
      dispatch(errorAlert({ message: err }))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const image = new Image()
      image.src = event.target?.result
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
      <input type="file" hidden accept=".jpg, .jpeg, .png" onChange={onImageChange} />
    </IconButton>
  )
}

export default UploadImage
