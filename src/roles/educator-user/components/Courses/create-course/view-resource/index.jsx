import { Box, Button } from '@mui/material'
import { VideoIcon, FileText, Lock } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useDownloadResourceMutation } from '../../../../../../services/admin'
import ContentPreview from '../../../../../../shared/components/layout/Course/content-preview'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'

const ViewResource = ({ lessonDetail, isEdit = true, handleOpenPremiumModal = () => {} }) => {
  const videoRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [resourceUrl, setResourceUrl] = useState('')
  const [downloadResource] = useDownloadResourceMutation()

  const isPdf = useMemo(() => lessonDetail?.lessonType === 'pdf', [lessonDetail])
  const isFreeOrPurchased = useMemo(
    () => isEdit || lessonDetail?.isFree || lessonDetail?.isCourseBought,
    [isEdit, lessonDetail],
  )

  const handleViewResource = async () => {
    try {
      const response = await downloadResource({
        lessonId: lessonDetail?._id,
        courseId: lessonDetail?.courseId,
        chapterId: lessonDetail?.chapterId,
      })

      if ('data' in response && response?.data?.url) {
        videoRef.current?.openModal()
        setResourceUrl(response.data.url)
      }
    } catch (error) {
      console.error('Error downloading resource:', error)
    }
  }

  const handleRedirectLesson = () => {
    navigate(`/dashboard/course/${lessonDetail?.courseId}/lessons`, {
      state: {
        chapterId: lessonDetail?.chapterId,
        lessonId: lessonDetail?._id,
      },
    })
  }

  return (
    <>
      {isFreeOrPurchased ? (
        <Button
          size="small"
          variant="outlined"
          startIcon={isPdf ? <FileText size={16} /> : <VideoIcon size={16} />}
          onClick={isEdit ? handleViewResource : handleRedirectLesson}
          color={isPdf ? 'secondary' : 'primary'}
          disabled={lessonDetail?.status !== 'completed'}
          sx={{
            gap: '0',
            width: '130px',
            background: 'none',
            borderRadius: '8px',
          }}
        >
          {isPdf
            ? t('education:EDUCATION_DASHBOARD.COURSE_DETAILS.VIEW_RESOURCE.READ_PDF')
            : t('education:EDUCATION_DASHBOARD.COURSE_DETAILS.VIEW_RESOURCE.WATCH_VIDEO')}
        </Button>
      ) : (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Lock size={16} />}
          onClick={handleOpenPremiumModal}
          sx={{ width: '130px' }}
          color="warning"
        >
          {t('education:EDUCATION_DASHBOARD.COURSE_DETAILS.VIEW_RESOURCE.LOCK')}
        </Button>
      )}

      <ModalBox ref={videoRef} size="lg">
        <Box
          sx={{
            height: 'calc(100vh - 200px)',
          }}
        >
          <ContentPreview url={resourceUrl} type={isPdf ? 'doc' : 'video'} />
        </Box>
      </ModalBox>
    </>
  )
}

ViewResource.propTypes = {
  lessonDetail: PropTypes.shape({
    _id: PropTypes.string,
    courseId: PropTypes.string,
    chapterId: PropTypes.string,
    lessonType: PropTypes.string,
    isFree: PropTypes.bool,
    isCourseBought: PropTypes.bool,
    status: PropTypes.string,
  }),
  isEdit: PropTypes.bool,
  handleOpenPremiumModal: PropTypes.func,
}

export default ViewResource
