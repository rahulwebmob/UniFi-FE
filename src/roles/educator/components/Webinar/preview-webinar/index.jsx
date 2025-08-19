import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { useGetDisplayScheduleTimeMutation } from '../../../../../services/admin'
import { iff, convHMtoUtc, convDateToUtc, getLocalTimezone } from '../../common/common'
import WebinarContent from '../webinar-content'

const PreviewWebinar = ({ webinarData, isTdSkip }) => {
  const { user } = useSelector((state) => state.user)
  const [updatedWebinarData, setUpdatedWebinarData] = useState({
    ...webinarData,
    _id: webinarData._id || '',
    educatorId: { firstName: user?.firstName, lastName: user?.lastName },
  })

  const [getDisplayScheduleTime] = useGetDisplayScheduleTimeMutation()

  const buildSchedulePayload = useCallback(() => {
    const { scheduleType, startDate, startTime, endTime, days } = webinarData

    if (['daily', 'one time'].includes(scheduleType || '')) {
      return {
        webinarId: webinarData._id || '',
        scheduleType,
        endTime: isTdSkip ? endTime : endTime ? convHMtoUtc(endTime) : undefined,
        startTime: isTdSkip ? startTime : startTime ? convHMtoUtc(startTime) : undefined,
        startDate: isTdSkip
          ? startDate
          : startDate && startTime
            ? convDateToUtc(startDate, startTime)
            : undefined,
      }
    }

    return {
      webinarId: webinarData._id || '',
      days: days?.map((day) => ({
        ...day,
        startTime: iff(
          Boolean(isTdSkip),
          day.startTime,
          day.startTime ? convHMtoUtc(day.startTime) : null,
        ),
        endTime: iff(Boolean(isTdSkip), day.endTime, day.endTime ? convHMtoUtc(day.endTime) : null),
      })),
      scheduleType,
      timezone: getLocalTimezone(),
    }
  }, [webinarData, isTdSkip])

  const fetchScheduleTime = useCallback(async () => {
    const payload = buildSchedulePayload()
    const response = await getDisplayScheduleTime(payload)
    if (!response.error) {
      setUpdatedWebinarData((prev) => ({
        ...prev,
        webinarScheduledObj: {
          join_date: response?.data?.data?.join_date,
          can_join: false,
        },
      }))
    }
  }, [buildSchedulePayload, getDisplayScheduleTime])

  const convertImageFileToUrl = useCallback(() => {
    if (webinarData?.image && webinarData.image instanceof File) {
      const imageUrl = URL.createObjectURL(webinarData.image)
      setUpdatedWebinarData((prev) => ({
        ...prev,
        thumbNail: imageUrl,
      }))
    }
  }, [webinarData?.image])

  useEffect(() => {
    void fetchScheduleTime()
    convertImageFileToUrl()
  }, [webinarData, fetchScheduleTime, convertImageFileToUrl])

  const transformedWebinarData = {
    _id: updatedWebinarData._id || '',
    title: updatedWebinarData.title || '',
    description: updatedWebinarData.description || '',
    thumbnail: updatedWebinarData.image ? String(updatedWebinarData.image) : '',
    duration: 0, // Default value
    status: 'draft',
    startTime: updatedWebinarData.startTime ? String(updatedWebinarData.startTime) : '',
    endTime: updatedWebinarData.endTime ? String(updatedWebinarData.endTime) : '',
    price: updatedWebinarData.price || 0,
    instructor: updatedWebinarData.educatorId,
    scheduleType: updatedWebinarData.scheduleType,
    category: updatedWebinarData.category,
    isPaid: updatedWebinarData.isPaid,
    resources: updatedWebinarData.resources?.map((resource) => ({
      id: resource.id || '',
      name: typeof resource.file === 'string' ? resource.file : resource.file.name,
      type: 'file',
      url: typeof resource.file === 'string' ? resource.file : URL.createObjectURL(resource.file),
      size: 0,
    })),
    days: updatedWebinarData.days,
  }

  return (
    <WebinarContent
      isEdit
      webinarData={transformedWebinarData}
      handleOpenPremiumModal={() => {
        // No-op for preview mode
      }}
    />
  )
}

PreviewWebinar.propTypes = {
  webinarData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    scheduleType: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    days: PropTypes.array,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    price: PropTypes.number,
    educatorId: PropTypes.object,
    category: PropTypes.array,
    isPaid: PropTypes.bool,
    resources: PropTypes.array,
  }).isRequired,
  isTdSkip: PropTypes.bool,
}

export default PreviewWebinar
