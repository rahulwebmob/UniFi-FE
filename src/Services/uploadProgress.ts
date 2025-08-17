import axios from 'axios'
import { createApi } from '@reduxjs/toolkit/query/react'

import { ENV } from '../utils/env'
import { onMutationStartedDefault } from './serviceUtility'

interface AxiosBaseQueryArgs {
  url: string
  method: string
  data?: unknown
  params?: Record<string, unknown>
  onUploadProgress?: (progressEvent: unknown) => void
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, onUploadProgress }: AxiosBaseQueryArgs) => {
    try {
      const token = localStorage.getItem('token')
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: token ? { token } : {},
        onUploadProgress,
      })
      return { data: result.data }
    } catch (axiosError) {
      const error = axiosError as { response?: { status?: number; data?: unknown }; message?: string }
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      }
    }
  }

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: axiosBaseQuery({ baseUrl: ENV.BASE_URL }),
  endpoints: (builder) => ({
    registerEducator: builder.mutation({
      query: ({ data, onUploadProgress }: { data: FormData; onUploadProgress: (progressEvent: unknown) => void }) => ({
        url: '/education-api/onboarding/register-educator',
        method: 'POST',
        data,
        params: {},
        onUploadProgress,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
  }),
})

export const { useRegisterEducatorMutation } = uploadApi
