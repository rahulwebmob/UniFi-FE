import React from 'react'
import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import SavedChapters from '../saved-chapters'
import AddLesson from './add-lessons-modal/add-lesson'

interface FormContextType {
  courseId?: string
  [key: string]: unknown
}

const Chapter: React.FC = () => {
  const { courseId } = useFormContext<FormContextType>()
  
  return (
    <Box>
      <AddLesson courseId={courseId} isChapter />
      <SavedChapters courseId={courseId} />
    </Box>
  )
}

export default Chapter