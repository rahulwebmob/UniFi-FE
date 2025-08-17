import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
        params,
      }),
    }),
    getCenterAds: builder.query({
      query: () => ({
        url: `/ads/get-row-categories`,
        method: 'GET',
      }),
    }),
    getAdWindows: builder.query({
      query: (params) => ({
        url: `/ads/get-ads-windows`,
        method: 'GET',
        params,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetAdsQuery, useGetAdWindowsQuery, useGetCenterAdsQuery } =
  adsApi
