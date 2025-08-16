import React from 'react'
import * as fabric from 'fabric'
import { Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { IconButton } from '@mui/material'

import { errorAlert } from '../../../../Redux/Reducers/AppSlice'

const UploadImage = () => {
  const dispatch = useDispatch()
  const canvas = useSelector((state) => state.education.canvas)

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
    if (!canvas) {
      return
    }

    const file = e.target.files[0]
    if (!file) return

    const err = checkFile(file)
    if (err) {
      dispatch(errorAlert({ message: err }))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const image = new Image()
      image.src = event.target.result
      image.onload = () => {
        const fabricImage = new fabric.Image(image)

        fabricImage.scaleToWidth(150)
        fabricImage.scaleToHeight(150)

        const canvasCenter = canvas.getCenter()
        fabricImage.set({
          left: canvasCenter.left,
          top: canvasCenter.top,
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
