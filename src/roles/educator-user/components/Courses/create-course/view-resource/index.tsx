import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Video, FileText } from 'lucide-react'
import { useRef, useMemo, useState } from 'react'

import { Box, Button } from '@mui/material'

import { useDownloadResourceMutation } from '../../../../../../services/admin'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'
import ContentPreview from '../../../../../../shared/components/layout/Course/content-preview'

interface ViewResourceProps {
  lessonDetail?: {
    lessonType?: string
    isFree?: boolean
    isCourseBought?: boolean
    resourceUrl?: string
    _id?: string
    courseId?: string
    chapterId?: string
    url?: string
    status?: string
  }
  isEdit?: boolean
  handleOpenPremiumModal?: () => void
}

const ViewResource = ({
  lessonDetail,
  isEdit,
  handleOpenPremiumModal,
}: ViewResourceProps) => {
  const videoRef = useRef<{
    openModal: () => void
    closeModal: () => void
  } | null>(null)
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [resourceUrl, setResourceUrl] = useState('')
  const [downloadResource] = useDownloadResourceMutation()

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
        resourceKey: lessonDetail?.resourceUrl || '',
        lessonId: lessonDetail?._id,
      })

      if (
        response?.data &&
        typeof response.data === 'object' &&
        response.data !== null &&
        !Array.isArray(response.data) &&
        'url' in response.data &&
        typeof (response.data as { url: unknown }).url === 'string'
      ) {
        if (videoRef.current) {
          videoRef.current.openModal()
        }
        setResourceUrl(String((response.data as { url: unknown }).url))
      }
    } catch {
      // error
    }
  }

  const handleRedirectLesson = () => {
    void navigate(`/dashboard/course/${lessonDetail?.courseId}/lessons`, {
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
            gap: '4px',
            minWidth: '130px',
            background: 'none',
            borderColor: (theme) =>
              isPdf ? theme.palette.text.secondary : theme.palette.primary.main,
            color: (theme) =>
              isPdf ? theme.palette.text.primary : theme.palette.primary.main,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            '& .MuiButton-startIcon': {
              marginRight: '6px',
              '& svg': {
                fontSize: '18px',
              },
            },
            '&:hover': {
              borderColor: (theme) =>
                isPdf ? theme.palette.text.primary : theme.palette.primary.dark,
              backgroundColor: (theme) =>
                isPdf
                  ? 'rgba(0, 0, 0, 0.04)'
                  : theme.palette.primary.light + '15',
            },
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
          sx={{
            minWidth: '130px',
            textTransform: 'none',
            fontWeight: 500,
            '& .MuiButton-startIcon': {
              marginRight: '6px',
              '& svg': {
                fontSize: '18px',
              },
            },
          }}
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
