import axios from 'axios'
import { createApi } from '@reduxjs/toolkit/query/react'

import { ENV } from '../utils/env'
import { onMutationStartedDefault } from './serviceUtility'

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, onUploadProgress }) => {
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
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      }
    }
  }

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: axiosBaseQuery({ baseUrl: ENV.BASE_URL }),
  endpoints: (builder) => ({
    registerEducator: builder.mutation({
      query: ({ data, onUploadProgress }) => ({
        url: '/education-api/onboarding/register-educator',
        method: 'POST',
        data,
        onUploadProgress,
      }),
      onQueryStarted: onMutationStartedDefault,
    }),
  }),
})

export const { useRegisterEducatorMutation } = uploadApi
