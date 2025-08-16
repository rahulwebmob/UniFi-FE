import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import CreateWebinar from '../create-webinar'
import { convUtcToLocal } from '../../common/common'
import { useGetWebinarDetailQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'

const EditWebinar = () => {
  const location = useLocation()
  const { webinarId, isPreview } = location?.state || {}

  const { data, error, isLoading } = useGetWebinarDetailQuery(
    { webinarId },
    { skip: !webinarId },
  )

  const defaultValues = useMemo(() => {
    const webinar = data?.data
    if (!webinar) return {}

    let timeFields = {}

    const resources = webinar.resources.map((item) => ({
      file: item,
      image: item?.thumbNail,
    }))

    if (
      webinar.scheduleType === 'one time' ||
      webinar.scheduleType === 'daily'
    ) {
      timeFields = {
        endTime: convUtcToLocal(webinar.endTime, webinar.startDate),
        startTime: convUtcToLocal(webinar.startTime, webinar.startDate),
        startDate: convUtcToLocal(webinar.startTime, webinar.startDate),
      }
    } else if (webinar.scheduleType === 'weekly') {
      timeFields = {
        days: webinar.days?.length
          ? webinar.days.map((day) => ({
              ...day,
              endTime: convUtcToLocal(day.endTime),
              startTime: convUtcToLocal(day.startTime),
            }))
          : [],
      }
    }

    return {
      resources,
      title: webinar.title,
      price: webinar.price,
      isPaid: webinar.isPaid,
      image: webinar.thumbNail,
      description: webinar.description,
      category: webinar.category || [],
      scheduleType: webinar.scheduleType,
      ...timeFields,
    }
  }, [data])

  return (
    <ApiMiddleware error={error} isLoading={isLoading} isData={!!data?.data}>
      <CreateWebinar
        isEdit
        isPreview={isPreview}
        savedDetails={data?.data}
        defaultValues={defaultValues}
        isPublished={data?.data?.status === 'published'}
      />
    </ApiMiddleware>
  )
}

export default EditWebinar
