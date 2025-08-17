// React import removed - JSX transform handles it
import { useFormContext } from 'react-hook-form'

import { Box } from '@mui/material'

import SavedChapters from '../saved-chapters'
import AddLesson from './add-lessons-modal/add-lesson'

interface CourseFormData {
  courseId?: string
  [key: string]: unknown
}

const Chapter = () => {
  const form = useFormContext<CourseFormData>()
  const courseId = form.getValues('courseId')

  return (
    <Box>
      <AddLesson
        courseId={courseId}
        isChapter
        defaultValues={{ isFree: false, lessonTitle: '', resource: '' }}
        handleClose={() => {
          /* No operation for chapter mode */
        }}
      />
      <SavedChapters courseId={courseId ?? ''} />
    </Box>
  )
}

export default Chapter
