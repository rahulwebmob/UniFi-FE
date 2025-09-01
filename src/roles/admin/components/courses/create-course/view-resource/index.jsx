import { Box, Button } from '@mui/material'
import { Video, FileText, Lock } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDownloadResourceMutation } from '../../../../../../services/admin'
import CourseContent from '../../../../../../shared/components/layout/Course/content-preview'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'

const ViewResource = ({ lessonDetail, isEdit }) => {
  const videoRef = useRef(null)
  const navigate = useNavigate()
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
          variant="contained"
          startIcon={isPdf ? <FileText size={16} /> : <Video size={16} />}
          onClick={isEdit ? handleViewResource : handleRedirectLesson}
          disabled={lessonDetail?.status !== 'completed'}
        >
          {isPdf ? 'Read PDF' : 'Watch Video'}
        </Button>
      ) : (
        <Button
          size="small"
          variant="contained"
          startIcon={<Lock size={16} />}
          onClick={() => {}}
          color="warning"
        >
          Locked
        </Button>
      )}

      <ModalBox ref={videoRef} size="lg">
        <Box
          sx={{
            height: 'calc(100vh - 200px)',
          }}
        >
          <CourseContent url={resourceUrl} type={isPdf ? 'doc' : 'video'} />
        </Box>
      </ModalBox>
    </>
  )
}

ViewResource.propTypes = {
  lessonDetail: PropTypes.oneOfType([PropTypes.object]).isRequired,
  isEdit: PropTypes.bool,
  handlePurchase: PropTypes.func,
}

export default ViewResource
