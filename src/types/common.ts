// Common type definitions for the application

export interface FileError {
  resource?: string
  [key: string]: string | undefined
}

export interface EducatorDetail {
  educatorId?: {
    firstName?: string
    lastName?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface NestedArrayObject {
  [key: string]: unknown[] | unknown
}

export interface UpdatedFieldsResult<T> {
  updatedFields: Partial<T>
  isIdentical: boolean
}

export interface PdfGenerationRequest {
  transactionId: string
}

export interface PdfGenerationResponse {
  error?: boolean
  data: string
}

export interface ApiResponse {
  error?: boolean
  data: unknown
}

export interface RequestCallback {
  (params: PdfGenerationRequest):
    | Promise<{
        unwrap: () => Promise<ApiResponse>
      }>
    | {
        unwrap: () => Promise<ApiResponse>
      }
}

export type FieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | File
  | unknown[]
  | Record<string, unknown>

export interface DataObject {
  [key: string]: FieldValue
}
