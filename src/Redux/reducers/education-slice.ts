import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

// Define interfaces for the state
interface EducationState {
  canvasId: string | null // Canvas element ID instead of the element itself
  isChatOpen: boolean
  strokeColor: string
  fillColor: string
  fontSize: number
  strokeWidth: number
  eraserWidth: number
  isSharedFile: boolean
  showPrompt: boolean
  isLoading: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  isAudioOn: boolean
}

const initialState: EducationState = {
  canvasId: null,
  isChatOpen: false,
  strokeColor: '#000',
  fillColor: '#E74C3C',
  fontSize: 10,
  strokeWidth: 5,
  eraserWidth: 10,
  isSharedFile: false,
  showPrompt: false,
  isLoading: false,
  isVideoOn: false,
  isScreenSharing: false,
  isAudioOn: false,
}

export const EducationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    updateCanvasId: (state, action: PayloadAction<string | null>) => {
      state.canvasId = action.payload
    },
    updateStrokeColor: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.strokeColor = payload
    },
    updateFillColor: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.fillColor = payload
    },
    toggleChat: (state) => {
      if (!state.isChatOpen) {
        state.isSharedFile = false
      }
      state.isChatOpen = !state.isChatOpen
    },
    updateFontSize: (state, action: PayloadAction<number>) => {
      const { payload } = action
      state.fontSize = payload
    },
    updateStrokeWidth: (state, action: PayloadAction<number>) => {
      const { payload } = action
      state.strokeWidth = payload
    },
    updateEraserWidth: (state, action: PayloadAction<number>) => {
      const { payload } = action
      state.eraserWidth = payload
    },
    toggleSharedFile: (state) => {
      if (!state.isSharedFile) {
        state.isChatOpen = false
      }
      state.isSharedFile = !state.isSharedFile
    },
    updateShowPrompt: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.showPrompt = payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.isLoading = payload
    },
    setVideoOn: (state, action: PayloadAction<boolean>) => {
      state.isVideoOn = action.payload
    },
    setScreenSharing: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharing = action.payload
    },
    setAudioOn: (state, action: PayloadAction<boolean>) => {
      state.isAudioOn = action.payload
    },
  },
})

export const {
  updateCanvasId,
  updateStrokeColor,
  updateFillColor,
  toggleChat,
  updateFontSize,
  updateStrokeWidth,
  updateEraserWidth,
  toggleSharedFile,
  updateShowPrompt,
  setLoading,
  setVideoOn,
  setScreenSharing,
  setAudioOn,
} = EducationSlice.actions

export default EducationSlice.reducer

// Export types
export type { EducationState }
