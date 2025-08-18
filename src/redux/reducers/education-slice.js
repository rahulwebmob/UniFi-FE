import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
    updateCanvasId: (state, action) => {
      state.canvasId = action.payload
    },
    updateStrokeColor: (state, action) => {
      const { payload } = action
      state.strokeColor = payload
    },
    updateFillColor: (state, action) => {
      const { payload } = action
      state.fillColor = payload
    },
    toggleChat: (state) => {
      if (!state.isChatOpen) {
        state.isSharedFile = false
      }
      state.isChatOpen = !state.isChatOpen
    },
    updateFontSize: (state, action) => {
      const { payload } = action
      state.fontSize = payload
    },
    updateStrokeWidth: (state, action) => {
      const { payload } = action
      state.strokeWidth = payload
    },
    updateEraserWidth: (state, action) => {
      const { payload } = action
      state.eraserWidth = payload
    },
    toggleSharedFile: (state) => {
      if (!state.isSharedFile) {
        state.isChatOpen = false
      }
      state.isSharedFile = !state.isSharedFile
    },
    updateShowPrompt: (state, action) => {
      const { payload } = action
      state.showPrompt = payload
    },
    setLoading: (state, action) => {
      const { payload } = action
      state.isLoading = payload
    },
    setVideoOn: (state, action) => {
      state.isVideoOn = action.payload
    },
    setScreenSharing: (state, action) => {
      state.isScreenSharing = action.payload
    },
    setAudioOn: (state, action) => {
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
