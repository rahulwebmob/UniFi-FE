import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { adminApi } from '../services/admin'
import { educationApi } from '../services/education'
import { onboardingApi } from '../services/onboarding'
import { stripeApi } from '../services/stripe'
import { uploadApi } from '../services/uploadProgress'

import AlertReducer from './reducers/app-slice'
import EducationReducer from './reducers/education-slice'
import UserSliceReducer, { signOut } from './reducers/user-slice'

const combinedReducers = combineReducers({
  user: UserSliceReducer,
  app: AlertReducer,
  education: EducationReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [stripeApi.reducerPath]: stripeApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
})

const rootReducer = (state, action) => {
  if (action.type === signOut.type) {
    // Socket disconnection removed - no longer needed
    return combinedReducers(undefined, action)
  }
  return combinedReducers(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(adminApi.middleware)
      .concat(onboardingApi.middleware)
      .concat(educationApi.middleware)
      .concat(stripeApi.middleware)
      .concat(uploadApi.middleware),
})

setupListeners(store.dispatch)

export default store
