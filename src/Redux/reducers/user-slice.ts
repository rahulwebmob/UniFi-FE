import type { PayloadAction } from '@reduxjs/toolkit'

import { jwtDecode } from 'jwt-decode'
import { createSlice } from '@reduxjs/toolkit'

// Define interfaces for the state

interface User {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  language?: string
  layout?: string[]
  appearance?: {
    language?: string
    menuPosition?: string
  }
  [key: string]:
    | string
    | string[]
    | { language?: string; menuPosition?: string }
    | undefined // For decoded token properties
}

interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null,
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ token: string }>) => {
      const { payload } = action
      localStorage.setItem('token', payload.token)
      const decodedToken = jwtDecode<User>(payload.token)
      state.user = {
        ...decodedToken,
        layout: [],
      }
    },
    signOut: (state) => {
      localStorage.removeItem('token')
      state.user = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      const { payload } = action
      state.user = { ...state.user, ...payload }
    },
    updateToken: (state, action: PayloadAction<{ token: string }>) => {
      const { payload } = action
      localStorage.setItem('token', payload.token)
      const decodedToken = jwtDecode<User>(payload.token)
      state.user = {
        layout: state.user?.layout || [],
        ...state.user,
        ...decodedToken,
      }
    },
    loggedIn: (state, action: PayloadAction<{ loggedUser: User }>) => {
      const { payload } = action
      state.user = { ...state.user, ...payload.loggedUser }
    },
  },
})

// Action creators are generated for each case reducer function
export const { signOut, signIn, updateUser, updateToken, loggedIn } =
  UserSlice.actions

export default UserSlice.reducer

// Export types
export type { User, UserState }
