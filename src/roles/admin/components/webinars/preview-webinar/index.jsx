import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useGetDisplayScheduleTimeMutation } from '../../../../../services/admin'
import {
  iff,
  convHMtoUtc,
  convDateToUtc,
  getLocalTimezone,
} from '../../../../../utils/webinar-utils'
import WebinarContent from '../webinar-content'

const PreviewWebinar = ({ webinarData, isTdSkip }) => {
  const { user } = useSelector((state) => state.user)
  const [updatedWebinarData, setUpdatedWebinarData] = useState({
    ...webinarData,
    educatorId: { firstName: user?.firstName, lastName: user?.lastName },
  })

  const [getDisplayScheduleTime] = useGetDisplayScheduleTimeMutation()

  const buildSchedulePayload = () => {
    const { scheduleType, startDate, startTime, endTime, days } = webinarData

    if (['daily', 'one time'].includes(scheduleType)) {
      return {
        scheduleType,
        endTime: isTdSkip ? endTime : convHMtoUtc(endTime),
        startTime: isTdSkip ? startTime : convHMtoUtc(startTime),
        startDate: isTdSkip ? startDate : convDateToUtc(startDate, startTime),
      }
    }

    return {
      days: days.map((day) => ({
        ...day,
        startTime: iff(isTdSkip, day.startTime, day.startTime ? convHMtoUtc(day.startTime) : null),
        endTime: iff(isTdSkip, day.endTime, day.endTime ? convHMtoUtc(day.endTime) : null),
      })),
      scheduleType,
      timezone: getLocalTimezone(),
    }
  }

  const fetchScheduleTime = async () => {
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
  }

  const convertImageFileToUrl = () => {
    if (webinarData?.image && webinarData.image instanceof File) {
      const imageUrl = URL.createObjectURL(webinarData.image)
      setUpdatedWebinarData((prev) => ({
        ...prev,
        thumbNail: imageUrl,
      }))
    }
  }

  useEffect(() => {
    fetchScheduleTime()
    convertImageFileToUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webinarData])

  return <WebinarContent isEdit webinarData={updatedWebinarData} />
}

PreviewWebinar.propTypes = {
  isTdSkip: PropTypes.bool.isRequired,
  webinarData: PropTypes.oneOfType([PropTypes.object]).isRequired,
}

export default PreviewWebinar
