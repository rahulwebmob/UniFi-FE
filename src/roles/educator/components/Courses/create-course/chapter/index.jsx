import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import SavedChapters from '../saved-chapters'

import AddLesson from './add-lessons-modal/add-lesson'

const Chapter = () => {
  const { courseId } = useFormContext()

  const defaultLessonValues = {
    lessonTitle: '',
    resource: '',
    isFree: false,
  }

  return (
    <Box>
      <AddLesson courseId={courseId} isChapter defaultValues={defaultLessonValues} />
      <SavedChapters courseId={courseId} />
    </Box>
  )
}

export default Chapter
