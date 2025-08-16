import type { PayloadAction } from '@reduxjs/toolkit'

import { jwtDecode } from 'jwt-decode'
import { createSlice } from '@reduxjs/toolkit'

// Define interfaces for the state
type Subscription = Record<string, boolean>;

interface User {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  language?: string
  layout?: string[]
  subscription?: Subscription
  appearance?: {
    language?: string
    menuPosition?: string
  }
  [key: string]: string | string[] | Subscription | { language?: string; menuPosition?: string } | undefined // For decoded token properties
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
    updateSubscription: (state, action: PayloadAction<{ key: string }[]>) => {
      const { payload } = action
      const updatedSubscription: Subscription = { ...state.user?.subscription }

      payload.map((item) => {
        if (item.key) {
          updatedSubscription[item.key] = true
        }
        return null
      })

      state.user = {
        ...state.user,
        subscription: updatedSubscription,
      }
    },

    loggedIn: (state, action: PayloadAction<{ loggedUser: User }>) => {
      const { payload } = action
      state.user = { ...state.user, ...payload.loggedUser }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  signOut,
  signIn,
  updateUser,
  updateToken,
  updateSubscription,
  loggedIn,
} = UserSlice.actions

export default UserSlice.reducer

// Export types
export type { User, UserState, Subscription }
