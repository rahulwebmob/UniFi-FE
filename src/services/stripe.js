import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '../utils/env'

import { onQueryStartedDefault } from './serviceUtility'

export const stripeApi = createApi({
  reducerPath: 'stripeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.BASE_URL}/payment-api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('token', token)
      }
      return headers
    },
  }),
  tagTypes: ['PaymentIntent', 'PaymentMethods', 'Subscriptions'],
  endpoints: (builder) => ({
    // Create a payment intent for one-time payments
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/create-payment-intent',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    // Create a subscription for recurring payments
    createSubscription: builder.mutation({
      query: (data) => ({
        url: '/create-subscription',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Subscriptions'],
    }),

    // Confirm payment with Stripe
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/confirm-payment',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    // Get customer's saved payment methods
    getPaymentMethods: builder.query({
      query: () => ({
        url: '/payment-methods',
        method: 'GET',
      }),
      providesTags: ['PaymentMethods'],
      onQueryStarted: onQueryStartedDefault,
    }),

    // Save a payment method for future use
    savePaymentMethod: builder.mutation({
      query: (data) => ({
        url: '/save-payment-method',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['PaymentMethods'],
    }),

    // Delete a saved payment method
    deletePaymentMethod: builder.mutation({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: 'DELETE',
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['PaymentMethods'],
    }),

    // Get subscription details
    getSubscriptionDetails: builder.query({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}`,
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
      onQueryStarted: onQueryStartedDefault,
    }),

    // Cancel a subscription
    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/cancel`,
        method: 'POST',
      }),
      onQueryStarted: onQueryStartedDefault,
      invalidatesTags: ['Subscriptions'],
    }),

    // Process education purchase with Stripe
    processEducationPayment: builder.mutation({
      query: (data) => ({
        url: '/process-education-payment',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    // Verify payment status
    verifyPaymentStatus: builder.query({
      query: (paymentIntentId) => ({
        url: `/verify-payment/${paymentIntentId}`,
        method: 'GET',
      }),
      onQueryStarted: onQueryStartedDefault,
    }),

    // Get payment history
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: '/payment-history',
        method: 'GET',
        params,
      }),
      onQueryStarted: onQueryStartedDefault,
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useCreateSubscriptionMutation,
  useConfirmPaymentMutation,
  useGetPaymentMethodsQuery,
  useSavePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetSubscriptionDetailsQuery,
  useCancelSubscriptionMutation,
  useProcessEducationPaymentMutation,
  useVerifyPaymentStatusQuery,
  useGetPaymentHistoryQuery,
} = stripeApi
