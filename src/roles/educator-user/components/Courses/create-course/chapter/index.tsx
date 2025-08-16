import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box } from '@mui/material'

import SavedChapters from '../saved-chapters'
import AddLesson from './add-lessons-modal/add-lesson'

const Chapter = () => {
  const { courseId } = useFormContext()
  return (
    <Box>
      <AddLesson courseId={courseId} isChapter />
      <SavedChapters courseId={courseId} />
    </Box>
  )
}

export default Chapter
