import { useSelector } from 'react-redux'
import React, { useState, useEffect, useCallback } from 'react'

import WebinarContent from '../webinar-content'
import { useGetDisplayScheduleTimeMutation } from '../../../../../services/admin'
import {
  iff,
  convHMtoUtc,
  convDateToUtc,
  getLocalTimezone,
} from '../../common/common'

const PreviewWebinar = ({ webinarData, isTdSkip }) => {
  const { user } = useSelector((state) => state.user)
  const [updatedWebinarData, setUpdatedWebinarData] = useState({
    ...webinarData,
    educatorId: { firstName: user?.firstName, lastName: user?.lastName },
  })

  const [getDisplayScheduleTime] = useGetDisplayScheduleTimeMutation()

  const buildSchedulePayload = useCallback(() => {
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
        startTime: iff(
          isTdSkip,
          day.startTime,
          day.startTime ? convHMtoUtc(day.startTime) : null,
        ),
        endTime: iff(
          isTdSkip,
          day.endTime,
          day.endTime ? convHMtoUtc(day.endTime) : null,
        ),
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

  return <WebinarContent isEdit webinarData={updatedWebinarData} />
}

export default PreviewWebinar
