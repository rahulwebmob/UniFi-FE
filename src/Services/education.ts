import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { onQueryStarted } from './serviceUtility'
import { ENV } from '../shared/utils/validation/env'

export const educationApi = createApi({
  reducerPath: 'educationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.BASE_URL}/education-api/app`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: (params) => ({
        url: `/get-all-courses`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['All-Course'],
    }),
    getParticularCourse: builder.query({
      query: (params) => ({
        url: `/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['Course'],
    }),
    getChapterDetails: builder.query({
      query: (params) => ({
        url: `/get-url-for-resource`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    getAllWebinars: builder.query({
      query: (params) => ({
        url: `/get-all-published-webinars`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['All-Webinar'],
    }),
    getParticularWebinarDetail: builder.query({
      query: (params) => ({
        url: `/get-particular-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      providesTags: ['Webinar'],
    }),
    getAttachmentsList: builder.query({
      query: (params) => ({
        url: `/get-webinar-resources-links`,
        method: 'GET',
        params,
      }),
    }),
    getEducationPayments: builder.query({
      query: (params) => ({
        url: `/my-payments`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
      transformResponse: (data) => data.data,
      keepUnusedDataFor: 0,
    }),
    getEducationInvoice: builder.query({
      query: (params) => ({
        url: `/get-my-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
    getCategoryList: builder.query({
      query: (params) => ({
        url: `/get-categories-list`,
        method: 'GET',
        params,
      }),
      onQueryStarted,
    }),
  }),
})
export const {
  useGetAllCoursesQuery,
  useGetAllWebinarsQuery,
  useGetChapterDetailsQuery,
  useGetAttachmentsListQuery,
  useGetParticularCourseQuery,
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
  // useGetPurchasedWebinarsQuery,
  useGetParticularWebinarDetailQuery,
  useGetCategoryListQuery,
} = educationApi
