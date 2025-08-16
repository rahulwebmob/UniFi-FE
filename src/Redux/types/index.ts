export type { EducationState } from '../reducers/EducationSlice'
// Export all Redux state types
export type { Alert, AppState, Language } from '../reducers/AppSlice'
export type { User, UserState, Subscription } from '../reducers/UserSlice'

// Root state type
import type { store } from '../Store'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch