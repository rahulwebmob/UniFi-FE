import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { onQueryStarted } from './serviceUtility'
import { ENV } from '../shared/utils/validation/env'

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.BASE_URL}/dashboard-api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAds: builder.query({
      query: (params) => ({
        url: `/ads/get-ads`,
        method: 'GET',
        params: { ...params },
      }),
      onQueryStarted,
    }),
    getCenterAds: builder.query({
      query: () => ({
        url: `/ads/get-row-categories`,
        method: 'GET',
      }),
      onQueryStarted,
    }),
    getAdWindows: builder.query({
      query: (params) => ({
        url: `/ads/get-ads-windows`,
        method: 'GET',
        params: { ...params },
      }),
      transformResponse: (response) => response.data,
      onQueryStarted,
    }),
  }),
})

export const { useGetAdsQuery, useGetAdWindowsQuery, useGetCenterAdsQuery } =
  adsApi
