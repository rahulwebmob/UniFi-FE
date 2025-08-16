import type Store from './Store'

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

// Define your state interfaces here
export interface AppState {
  appFontSize: number
  mode: 'light' | 'dark'
  appColor: string
  language: {
    code: string
    direction: 'ltr'
  }
  [key: string]: unknown
}

export interface UserState {
  user: {
    _id: string
    isChatEnabled: boolean
    subscription: Record<string, unknown>
    [key: string]: unknown
  }
  menuBar: string
  notificationCount: number
  [key: string]: unknown
}
