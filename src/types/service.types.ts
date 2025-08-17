// Service Utility Types

import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { RootState } from './redux.types'

// RTK Query Lifecycle Types
export interface QueryLifecycleApi<ResultType = unknown, ArgType = unknown> {
  dispatch: import('@reduxjs/toolkit').Dispatch
  getState: () => RootState
  extra: unknown
  requestId: string
  endpoint: string
  type: 'query' | 'mutation'
  originalArgs: ArgType
  getCacheEntry: () => ResultType | undefined
  updateCache: (updateRecipe: (draft: ResultType) => void) => void
}

export interface QueryFulfilledAction<ResultType = unknown, ArgType = unknown> {
  data: ResultType
  meta: {
    arg: ArgType
    requestId: string
    requestStatus: 'fulfilled'
  }
}

export interface QueryRejectedAction<ArgType = unknown> {
  error: ApiError
  meta: {
    arg: ArgType
    requestId: string
    requestStatus: 'rejected'
  }
}

export interface ApiError {
  status?: number
  data?: {
    message?: string
    detail?: string
    error?: string
    statusCode?: number
  }
  message?: string
  error?: {
    status?: number
    data?: {
      message?: string
      detail?: string
    }
    message?: string
  }
}

export type QueryLifecyclePromise<
  ResultType = unknown,
  ArgType = unknown,
> = Promise<QueryFulfilledAction<ResultType, ArgType>>

// OnQueryStarted Types
export interface OnQueryStartedContext<
  ResultType = unknown,
  ArgType = unknown,
> {
  dispatch: import('@reduxjs/toolkit').Dispatch
  getState: () => RootState
  extra: unknown
  requestId: string
  queryFulfilled: QueryLifecyclePromise<ResultType, ArgType>
  getCacheEntry: () => ResultType | undefined
  updateCache: (updateRecipe: (draft: ResultType) => void) => void
}

export type OnQueryStartedHandler<ArgType = unknown, ResultType = unknown> = (
  arg: ArgType,
  context: OnQueryStartedContext<ResultType, ArgType>,
) => Promise<void> | void

export type OnMutationStartedHandler<
  ArgType = unknown,
  ResultType = unknown,
> = OnQueryStartedHandler<ArgType, ResultType>

// Service Configuration Types
export interface ServiceConfig {
  baseUrl: string
  prepareHeaders?: (
    headers: Headers,
    api: {
      getState: () => RootState
      endpoint: string
      type: 'query' | 'mutation'
      forced?: boolean
    },
  ) => Headers | void
  timeout?: number
  credentials?: RequestCredentials
}

// Note: Common response types are defined in api.types.ts

export interface ErrorResponse {
  message: string
  statusCode: number
  error?: string
  details?: unknown
}

// Tag Types for Cache Invalidation
export type ApiTag =
  | 'User'
  | 'Me'
  | 'UserProfile'
  | 'Course'
  | 'Courses'
  | 'All-Course'
  | 'Chapter'
  | 'Chapters'
  | 'Lesson'
  | 'Lessons'
  | 'Webinar'
  | 'Webinars'
  | 'All-Webinar'
  | 'Subscription'
  | 'Invoice'
  | 'Payment'
  | 'Tutor'
  | 'ApprovedTutors'
  | 'Educator'
  | 'Category'
  | 'Zoom-meetings'
  | 'partners'
  | 'Layouts'

export type TagDescription<TagType extends string = ApiTag> =
  | TagType
  | { type: TagType; id?: string | number }

// Endpoint Builder Types
export interface EndpointDefinition<QueryArg = unknown, ResultType = unknown> {
  query?: (arg: QueryArg) => string | Record<string, unknown>
  queryFn?: (
    arg: QueryArg,
    api: QueryLifecycleApi<ResultType, QueryArg>,
    extraOptions: Record<string, unknown>,
    baseQuery: BaseQueryFn,
  ) => Promise<{ data: ResultType } | { error: ApiError }>
  transformResponse?: (
    response: unknown,
    meta: Record<string, unknown>,
    arg: QueryArg,
  ) => ResultType
  transformErrorResponse?: (
    response: unknown,
    meta: Record<string, unknown>,
    arg: QueryArg,
  ) => ApiError
  onQueryStarted?: OnQueryStartedHandler<QueryArg, ResultType>
  onCacheEntryAdded?: (
    arg: QueryArg,
    api: QueryLifecycleApi<ResultType, QueryArg>,
  ) => Promise<void> | void
  providesTags?: (
    result: ResultType | undefined,
    error: ApiError | undefined,
    arg: QueryArg,
  ) => TagDescription<ApiTag>[]
  invalidatesTags?: TagDescription<ApiTag>[]
  keepUnusedDataFor?: number
  serializeQueryArgs?: (args: {
    queryArgs: QueryArg
    endpointDefinition: EndpointDefinition<QueryArg, ResultType>
    endpointName: string
  }) => string
}

// Hook Types
export interface QueryHookResult<ResultType = unknown> {
  data?: ResultType
  error?: ApiError
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  isUninitialized: boolean
  refetch: () => void
}

export interface MutationHookResult<ArgType = unknown, ResultType = unknown> {
  trigger: (arg: ArgType) => Promise<ResultType>
  data?: ResultType
  error?: ApiError
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isUninitialized: boolean
  reset: () => void
}

export interface LazyQueryHookResult<ArgType = unknown, ResultType = unknown> {
  trigger: (arg: ArgType) => Promise<ResultType>
  data?: ResultType
  error?: ApiError
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  isUninitialized: boolean
  lastArg?: ArgType
}

// Service Utility Function Types
export interface ServiceUtilityConfig {
  showSuccessAlert?: boolean
  showErrorAlert?: boolean
  redirectOnUnauthorized?: boolean
  retryOnError?: boolean
  maxRetries?: number
  retryDelay?: number
}

export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>
  onRequestError?: (error: unknown) => unknown
}

export interface ResponseInterceptor {
  onResponse?: (response: Response) => Response | Promise<Response>
  onResponseError?: (error: unknown) => unknown
}

// File Upload Types
export interface UploadConfig {
  url: string
  file: File
  onProgress?: (progress: number) => void
  onComplete?: (response: unknown) => void
  onError?: (error: unknown) => void
  headers?: Record<string, string>
  metadata?: Record<string, unknown>
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// WebSocket Types for Real-time Features
export interface SocketConfig {
  url: string
  reconnect?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
}

export interface SocketMessage<T = unknown> {
  event: string
  data: T
  timestamp: string
  id?: string
}

// Cache Utility Types
export interface CacheConfig {
  maxAge?: number
  maxSize?: number
  excludeHeaders?: boolean
  excludeQuery?: boolean
}

export interface CachedEntry<T = unknown> {
  data: T
  timestamp: number
  expiresAt: number
  size: number
}

// Retry Configuration
export interface RetryConfig {
  maxAttempts: number
  delay: number
  backoff?: 'linear' | 'exponential'
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

// Polling Configuration
export interface PollingConfig {
  interval: number
  enabled: boolean
  skipPollingIfUnfocused?: boolean
  refetchOnFocus?: boolean
  refetchOnReconnect?: boolean
}

// Optimistic Update Types
export interface OptimisticUpdate<ArgType = unknown, ResultType = unknown> {
  onStart?: (
    arg: ArgType,
    context: {
      dispatch: import('@reduxjs/toolkit').Dispatch
      getState: () => RootState
    },
  ) => void
  onError?: (
    error: unknown,
    arg: ArgType,
    context: {
      dispatch: import('@reduxjs/toolkit').Dispatch
      getState: () => RootState
      rollback: () => void
    },
  ) => void
  onSuccess?: (
    result: ResultType,
    arg: ArgType,
    context: {
      dispatch: import('@reduxjs/toolkit').Dispatch
      getState: () => RootState
    },
  ) => void
}
