import { Typography, Box, IconButton } from '@mui/material'
import { Edit, Plus } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'

import AddLesson from './add-lesson'

const AddLessonsModal = ({
  chapterId,
  courseId,
  isEdit,
  defaultValues = {
    lessonTitle: '',
    resource: '',
    isFree: false,
  },
  lessonId = '',
}) => {
  const { t } = useTranslation('education')
  const lessionRef = useRef(null)

  return (
    <>
      {isEdit ? (
        <IconButton color="primary" onClick={() => lessionRef.current?.openModal()}>
          <Edit size={20} />
        </IconButton>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Typography
            onClick={() => lessionRef.current?.openModal()}
            variant="body1"
            color="primary"
            mt={1}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Plus size={20} /> {t('EDUCATOR.SAVED_CHAPTERS.ADD_MORE_LESSON')}
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
  chapterId: PropTypes.string,
  courseId: PropTypes.string,
  isEdit: PropTypes.bool,
  defaultValues: PropTypes.shape({
    lessonTitle: PropTypes.string,
    resource: PropTypes.string,
    isFree: PropTypes.bool,
  }),
  lessonId: PropTypes.string,
}

export default AddLessonsModal
