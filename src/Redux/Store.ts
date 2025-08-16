import type { AnyAction } from '@reduxjs/toolkit'

import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { adminApi } from '../services/admin'
import { educationApi } from '../services/education'
import AlertReducer from '../redux/reducers/app-slice'
import { onboardingApi } from '../services/onboarding'
import { uploadApi } from '../services/uploadProgress'
import { disconnectAllSockets } from '../services/sockets'
import EducationReducer from '../redux/reducers/education-slice'
import UserSliceReducer, { signOut } from '../redux/reducers/user-slice'

const combinedReducers = combineReducers({
  user: UserSliceReducer,
  app: AlertReducer,
  education: EducationReducer,
  [adminApi.reducerPath]: adminApi.reducer,
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
