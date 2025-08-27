import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
    successAlert: (state, action) => {
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
    errorAlert: (state, action) => {
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
  },
})

export const { successAlert, errorAlert, removeAlert, enterFullscreen, exitFullscreen } =
  AppSlice.actions

export default AppSlice.reducer
