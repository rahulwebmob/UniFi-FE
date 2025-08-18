import React, { useRef, useState, useMemo } from 'react'
import { Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { VideoIcon, FileText, Lock } from 'lucide-react'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'
import { useDownloadResourceMutation } from '../../../../../../services/admin'
import ContentPreview from '../../../../../../shared/components/layout/Course/content-preview'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { RootState } from '../../../../../../redux/types'

interface LessonDetail {
  _id: string
  courseId: string
  chapterId: string
  lessonType?: string
  isFree?: boolean
  isCourseBought?: boolean
  status?: string
  [key: string]: unknown
}

interface ViewResourceProps {
  lessonDetail: LessonDetail
  isEdit?: boolean
  handleOpenPremiumModal?: () => void
}

interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

const ViewResource: React.FC<ViewResourceProps> = ({ 
  lessonDetail, 
  isEdit = true, 
  handleOpenPremiumModal = () => {} 
}) => {
  const videoRef = useRef<ModalBoxHandle>(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const { direction } = useSelector((state: RootState) => state.app.language)
  const [resourceUrl, setResourceUrl] = useState('')
  const [downloadResource] = useDownloadResourceMutation()
  const isRTL = direction === 'rtl'

  const isPdf = useMemo(
    () => lessonDetail?.lessonType === 'pdf',
    [lessonDetail],
  )
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
            gap: isRTL ? '10px' : '0',
            width: '130px',
            background: 'none',
            borderRadius: '8px',
          }}
        >
          {isPdf
            ? t(
                'education:EDUCATION_DASHBOARD.COURSE_DETAILS.VIEW_RESOURCE.READ_PDF',
              )
            : t(
                'education:EDUCATION_DASHBOARD.COURSE_DETAILS.VIEW_RESOURCE.WATCH_VIDEO',
              )}
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

export default ViewResource