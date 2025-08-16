import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import i18n from '../../localization/i18n'

// Define interfaces for the state
interface Alert {
  key: string
  title: string
  severity: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface Language {
  code: string
  value: string
  label: string
  direction: 'ltr' | 'rtl'
}

interface AppState {
  alerts: Alert[]
  isLoading: boolean
  language: Language
  isFullscreen: boolean
}

const initialState: AppState = {
  alerts: [],
  isLoading: false,
  language: {
    code: 'en',
    value: 'ENGLISH',
    label: 'English',
    direction: 'ltr',
  },
  isFullscreen: false,
}

export const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    successAlert: (state, action: PayloadAction<{ message: string }>) => {
      const { payload } = action
      const key = `success-${payload.message}`
      const exists = state.alerts.some((alert) => alert.key === key)
      if (!exists) {
        state.alerts.push({
          key,
          title: 'Success',
          severity: 'success',
          message: payload.message,
        })
      }
    },
    errorAlert: (state, action: PayloadAction<{ message: string }>) => {
      const { payload } = action
      const key = `error-${payload.message}`
      const exists = state.alerts.some((alert) => alert.key === key)
      if (!exists) {
        state.alerts.push({
          key,
          title: 'Error',
          severity: 'error',
          message: payload.message,
        })
      }
    },

    removeAlert: (state) => {
      state.alerts.splice(0, 1)
    },

    enterFullscreen: (state) => {
      state.isFullscreen = true
    },
    exitFullscreen: (state) => {
      state.isFullscreen = false
    },
    updateLanguage: (state, action: PayloadAction<Language>) => {
      const { payload } = action
      state.language = { ...payload }
      void i18n.changeLanguage(payload?.code)
    },
  },
})

export const {
  successAlert,
  errorAlert,
  removeAlert,
  enterFullscreen,
  exitFullscreen,
  updateLanguage,
} = AppSlice.actions

export default AppSlice.reducer

// Export types
export type { Alert, AppState, Language }
