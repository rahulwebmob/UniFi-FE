import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import CreateWebinar from '../create-webinar'
import { convUtcToLocal } from '../../common/common'
import { useGetWebinarDetailQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import type { WebinarResource } from '../../../../../types/education.types'

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

    const resources = webinar.resources?.map((item: WebinarResource) => ({
      file: item,
    }))

    if (
      webinar.scheduleType === 'one time' ||
      webinar.scheduleType === 'daily'
    ) {
      timeFields = {
        endTime: convUtcToLocal(webinar.endTime, webinar.startDate) || undefined,
        startTime: convUtcToLocal(webinar.startTime, webinar.startDate) || undefined,
        startDate: convUtcToLocal(webinar.startTime, webinar.startDate) || undefined,
      }
    } else if (webinar.scheduleType === 'weekly') {
      timeFields = {
        days: webinar.days?.length
          ? webinar.days.map((day: { day: string; endTime: string; startTime: string }) => ({
              ...day,
              endTime: convUtcToLocal(day.endTime) || undefined,
              startTime: convUtcToLocal(day.startTime) || undefined,
            }))
          : [],
      }
    }

    return {
      resources,
      title: webinar.title,
      price: webinar.price,
      isPaid: webinar.isPaid,
      image: webinar.thumbnail || webinar.thumbNail,
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
