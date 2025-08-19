import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetWebinarDetailQuery } from '../../../../../services/admin'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import { convUtcToLocal } from '../../common/common'
import CreateWebinar from '../create-webinar'

const EditWebinar = () => {
  const location = useLocation()
  const { webinarId, isPreview } = location?.state || {}

  const { data, error, isLoading } = useGetWebinarDetailQuery({ webinarId }, { skip: !webinarId })

  const defaultValues = useMemo(() => {
    const webinar = data?.data
    if (!webinar) {
      return {}
    }

    let timeFields = {}

    const resources = webinar.resources?.map((item) => ({
      file: item,
    }))

    if (webinar.scheduleType === 'one time' || webinar.scheduleType === 'daily') {
      timeFields = {
        endTime: convUtcToLocal(webinar.endTime, webinar.startDate) || undefined,
        startTime: convUtcToLocal(webinar.startTime, webinar.startDate) || undefined,
        startDate: convUtcToLocal(webinar.startTime, webinar.startDate) || undefined,
      }
    } else if (webinar.scheduleType === 'weekly') {
      timeFields = {
        days:
          Array.isArray(webinar.days) && webinar.days.length
            ? webinar.days.map((day) => ({
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
        savedDetails={
          data?.data
            ? {
                ...data.data,
                startTime: data.data.startTime ? new Date(data.data.startTime) : undefined,
                endTime: data.data.endTime ? new Date(data.data.endTime) : undefined,
                resources: data.data.resources?.map((resource) => ({
                  file: resource.url || resource.name || '',
                  id: resource._id,
                })),
              }
            : undefined
        }
        defaultValues={defaultValues}
        isPublished={data?.data?.status === 'published'}
      />
    </ApiMiddleware>
  )
}

export default EditWebinar
