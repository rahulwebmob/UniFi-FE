import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../shared/utils/validation/env'
import { onMutationStarted } from './serviceUtility'
// Type imports will be reorganized

export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }
      return headers
    },
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    // Admin authentication apis
    adminLogin: builder.mutation<any, any>({
      query: (data) => ({
        url: `/admin-api/auth/login`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
    adminLogout: builder.mutation<any, any>({
      query: (postData) => ({
        url: `/admin-api/auth/logout`,
        method: 'POST',
        body: postData,
      }),
      onQueryStarted: onMutationStarted,
    }),
    editAdminProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin-api/admin-actions/edit-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
      onQueryStarted: onMutationStarted,
    }),
    adminForgetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin-api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onMutationStarted,
    }),
  }),
})

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useEditAdminProfileMutation,
  useAdminForgetPasswordMutation,
} = onboardingApi
