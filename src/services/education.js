import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../utils/env'

import { onQueryStartedDefault } from './serviceUtility'

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
  tagTypes: ['All-Course', 'Course', 'All-Webinar', 'Webinar'],
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: (params) => ({
        url: `/get-all-courses`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['All-Course'],
    }),
    getParticularCourse: builder.query({
      query: (params) => ({
        url: `/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Course'],
    }),
    getChapterDetails: builder.query({
      query: (params) => ({
        url: `/get-url-for-resource`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllWebinars: builder.query({
      query: (params) => ({
        url: `/get-all-published-webinars`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['All-Webinar'],
    }),
    getParticularWebinarDetail: builder.query({
      query: (params) => ({
        url: `/get-particular-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Webinar'],
    }),
    getAttachmentsList: builder.query({
      query: (params) => ({
        url: `/get-webinar-resources-links`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationPayments: builder.query({
      query: (params) => ({
        url: `/my-payments`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response) => response.data?.data || [],
      keepUnusedDataFor: 0,
    }),
    getEducationInvoice: builder.query({
      query: (params) => ({
        url: `/get-my-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getCategoryList: builder.query({
      query: () => ({
        url: `/get-categories-list`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
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
