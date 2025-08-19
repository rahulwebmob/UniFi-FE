import { Box, Button } from '@mui/material'
import { Video, FileText, Lock } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useDownloadResourceMutation } from '../../../../../../services/admin'
import ContentPreview from '../../../../../../shared/components/layout/Course/content-preview'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'

const ViewResource = ({ lessonDetail, isEdit, handleOpenPremiumModal }) => {
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

      if (response?.data?.url) {
        videoRef.current.openModal()
        setResourceUrl(response.data.url)
      }
    } catch {
      // error handling
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
          startIcon={isPdf ? <FileText size={16} /> : <Video size={16} />}
          onClick={isEdit ? handleViewResource : handleRedirectLesson}
          color={isPdf ? 'secondary' : 'primary'}
          disabled={lessonDetail?.status !== 'completed'}
          sx={{
            gap: '0',
            width: '130px',
            background: 'none',
            borderColor: (theme) => (isPdf ? theme.palette.white.main : theme.palette.primary.main),
            color: (theme) => (isPdf ? theme.palette.white.main : theme.palette.primary.main),
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
  lessonDetail: PropTypes.oneOfType([PropTypes.object]).isRequired,
  isEdit: PropTypes.bool,
  handleOpenPremiumModal: PropTypes.func,
}

ViewResource.defaultProps = {
  isEdit: true,
  handleOpenPremiumModal: () => {},
}

export default ViewResource
