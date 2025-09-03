import { createApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'

import { ENV } from '../utils/env'

import { onMutationStarted } from './serviceUtility'

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
      const error = axiosError
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
      query: ({ data, onUploadProgress }) => ({
        url: '/education-api/onboarding/register-educator',
        method: 'POST',
        data,
        params: {},
        onUploadProgress,
      }),
      onQueryStarted: onMutationStarted,
    }),
  }),
})

export const { useRegisterEducatorMutation } = uploadApi
