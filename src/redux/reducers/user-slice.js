import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

const initialState = {
  user: null,
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const { payload } = action
      localStorage.setItem('token', payload.token)
      const decodedToken = jwtDecode(payload.token)
      state.user = {
        ...decodedToken,
        layout: [],
      }
    },
    signOut: (state) => {
      localStorage.removeItem('token')
      state.user = null
    },
    updateUser: (state, action) => {
      const { payload } = action
      if ('user' in payload && payload.user) {
        state.user = { ...state.user, ...payload.user }
      } else {
        state.user = { ...state.user, ...payload }
      }
    },
    updateToken: (state, action) => {
      const { payload } = action
      localStorage.setItem('token', payload.token)
      const decodedToken = jwtDecode(payload.token)
      state.user = {
        layout: state.user?.layout || [],
        ...state.user,
        ...decodedToken,
      }
    },
    loggedIn: (state, action) => {
      const { payload } = action
      state.user = { ...state.user, ...payload.loggedUser }
    },
  },
})

// Action creators are generated for each case reducer function
export const { signOut, signIn, updateUser, updateToken, loggedIn } = UserSlice.actions

export default UserSlice.reducer
