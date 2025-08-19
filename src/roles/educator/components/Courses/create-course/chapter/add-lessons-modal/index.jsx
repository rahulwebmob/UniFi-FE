import { Typography, Box, IconButton } from '@mui/material'
import { Edit2, Plus } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'

import AddLesson from './add-lesson'

const AddLessonsModal = ({ chapterId, courseId, isEdit, defaultValues, lessonId }) => {
  const { t } = useTranslation('education')
  const lessionRef = useRef(null)

  return (
    <>
      {isEdit ? (
        <IconButton color="primary">
          <Edit2 onClick={() => lessionRef.current?.openModal()} size={24} />
        </IconButton>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Typography
            onClick={() => lessionRef.current?.openModal()}
            variant="body1"
            color="primary"
            mt={1}
            sx={{ cursor: 'pointer' }}
          >
            <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            {t('EDUCATOR.SAVED_CHAPTERS.ADD_MORE_LESSON')}
          </Typography>
        </Box>
      )}
      <ModalBox ref={lessionRef} size="sm">
        <AddLesson
          chapterId={chapterId}
          courseId={courseId}
          isEdit={isEdit}
          defaultValues={defaultValues}
          lessonId={lessonId}
          handleClose={() => lessionRef.current?.closeModal()}
        />
      </ModalBox>
    </>
  )
}

AddLessonsModal.propTypes = {
  lessonId: PropTypes.string,
  isEdit: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  chapterId: PropTypes.string.isRequired,
  defaultValues: PropTypes.oneOfType([PropTypes.object]),
}

AddLessonsModal.defaultProps = {
  defaultValues: {
    lessonTitle: '',
    resource: '',
    isFree: false,
  },
  lessonId: '',
}

export default AddLessonsModal
