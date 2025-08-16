import type { AnyAction } from '@reduxjs/toolkit'

import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { adminApi } from '../Services/admin'
import AlertReducer from './Reducers/AppSlice'
import { adsApi } from '../Services/advertisement'
import { educationApi } from '../Services/education'
import { onboardingApi } from '../Services/onboarding'
import { uploadApi } from '../Services/uploadProgress'
import EducationReducer from './Reducers/EducationSlice'
import { disconnectAllSockets } from '../Services/sockets'
import UserSliceReducer, { signOut } from './Reducers/UserSlice'

const combinedReducers = combineReducers({
  user: UserSliceReducer,
  app: AlertReducer,
  education: EducationReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [adsApi.reducerPath]: adsApi.reducer,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
})

const rootReducer = (
  state: ReturnType<typeof combinedReducers> | undefined,
  action: AnyAction,
) => {
  if (action.type === signOut.type) {
    disconnectAllSockets(true)
    state = undefined
  }
  return combinedReducers(state, action)
}

const Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(adminApi.middleware)
      .concat(onboardingApi.middleware)
      .concat(educationApi.middleware)
      .concat(uploadApi.middleware),
})

setupListeners(Store.dispatch)

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store
