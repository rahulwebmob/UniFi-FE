import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../utils/env'
import { onQueryStartedDefault } from './serviceUtility'

import type {
  GetAllCoursesRequest,
  GetAllCoursesResponse,
  GetParticularCourseRequest,
  GetParticularCourseResponse,
  GetChapterDetailsRequest,
  GetChapterDetailsResponse,
  GetAllWebinarsRequest,
  GetAllWebinarsResponse,
  GetParticularWebinarDetailRequest,
  GetParticularWebinarDetailResponse,
  GetAttachmentsListRequest,
  GetAttachmentsListResponse,
  GetEducationPaymentsRequest,
  GetEducationPaymentsResponse,
  GetEducationInvoiceRequest,
  GetEducationInvoiceResponse,
  GetCategoryListResponse,
} from './education.type'
import type { PaymentData } from '../types/education.types'

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
    getAllCourses: builder.query<GetAllCoursesResponse, GetAllCoursesRequest>({
      query: (params) => ({
        url: `/get-all-courses`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['All-Course'],
    }),
    getParticularCourse: builder.query<GetParticularCourseResponse, GetParticularCourseRequest>({
      query: (params) => ({
        url: `/get-particular-course-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Course'],
    }),
    getChapterDetails: builder.query<GetChapterDetailsResponse, GetChapterDetailsRequest>({
      query: (params) => ({
        url: `/get-url-for-resource`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getAllWebinars: builder.query<GetAllWebinarsResponse, GetAllWebinarsRequest>({
      query: (params) => ({
        url: `/get-all-published-webinars`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['All-Webinar'],
    }),
    getParticularWebinarDetail: builder.query<GetParticularWebinarDetailResponse, GetParticularWebinarDetailRequest>({
      query: (params) => ({
        url: `/get-particular-webinar-details`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      providesTags: ['Webinar'],
    }),
    getAttachmentsList: builder.query<GetAttachmentsListResponse, GetAttachmentsListRequest>({
      query: (params) => ({
        url: `/get-webinar-resources-links`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getEducationPayments: builder.query<PaymentData[], GetEducationPaymentsRequest>({
      query: (params) => ({
        url: `/my-payments`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
      transformResponse: (response: GetEducationPaymentsResponse) => response.data?.data || [],
      keepUnusedDataFor: 0,
    }),
    getEducationInvoice: builder.query<GetEducationInvoiceResponse, GetEducationInvoiceRequest>({
      query: (params) => ({
        url: `/get-my-payment-invoice`,
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
    getCategoryList: builder.query<GetCategoryListResponse, void>({
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
