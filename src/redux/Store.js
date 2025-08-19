import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import AlertReducer from '../redux/reducers/app-slice'
import EducationReducer from '../redux/reducers/education-slice'
import UserSliceReducer, { signOut } from '../redux/reducers/user-slice'
import { adminApi } from '../services/admin'
import { educationApi } from '../services/education'
import { onboardingApi } from '../services/onboarding'
import { disconnectAllSockets } from '../services/sockets'
import { uploadApi } from '../services/uploadProgress'

const combinedReducers = combineReducers({
  user: UserSliceReducer,
  app: AlertReducer,
  education: EducationReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [educationApi.reducerPath]: educationApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
})

const rootReducer = (state, action) => {
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

export default Store
