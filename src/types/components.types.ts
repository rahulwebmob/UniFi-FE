// Common Component Types

import type { ReactNode, CSSProperties } from 'react'
import type { Theme } from '@mui/material/styles'

// Table Types
export interface TableColumn<T = Record<string, unknown>> {
  accessorKey: keyof T | string
  header: string
  Cell?: (props: {
    cell: { getValue: () => unknown }
    row: { original: T }
  }) => ReactNode
  size?: number
  enableSorting?: boolean
  enableColumnFilter?: boolean
}

export interface PaginationData {
  totalPages: number
  currentPage?: number
  totalItems?: number
  itemsPerPage?: number
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  error?: Error | null
  pagination?: PaginationData
  onPageChange?: (page: number) => void
  onRowClick?: (row: T) => void
}

// Form Types
export interface FormFieldProps {
  name: string
  label: string
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  helperText?: string
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// Modal Types
export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  actions?: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  fullScreen?: boolean
}

// Navigation Types
export interface NavItem {
  id: string
  label: string
  path?: string
  icon?: ReactNode
  children?: NavItem[]
  onClick?: () => void
  disabled?: boolean
}

// Theme Types
export interface ThemeColors {
  primary: string
  secondary: string
  error: string
  warning: string
  info: string
  success: string
  text: {
    primary: string
    secondary: string
    disabled: string
  }
  background: {
    default: string
    paper: string
  }
}

// Common Props Types
export interface WithChildren {
  children: ReactNode
}

export interface WithClassName {
  className?: string
}

export interface WithStyle {
  style?: CSSProperties
  sx?: CSSProperties | ((theme: Theme) => CSSProperties)
}

// API Response Types
export interface ApiListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiItemResponse<T> {
  data: T
  message?: string
}

// File Upload Types
export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onUpload: (files: File[]) => void | Promise<void>
  onError?: (error: Error) => void
  disabled?: boolean
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadedAt: Date
  progress?: number
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  error?: string
}

// Date Types
export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

// Search Types
export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

// Notification Types
export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

// Chart Types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

// Status Types
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = unknown> {
  data: T | null
  status: Status
  error: Error | null
}

// User Types
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: string
  createdAt: Date
  updatedAt: Date
}

// Common Event Handlers
export type ClickHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>,
) => void
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void
export type KeyboardHandler<T = HTMLElement> = (
  event: React.KeyboardEvent<T>,
) => void

// Utility Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ValueOf<T> = T[keyof T]
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
