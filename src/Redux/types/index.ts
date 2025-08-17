export type { User, UserState } from '../reducers/user-slice'
export type { EducationState } from '../reducers/education-slice'
// Export all Redux state types
export type { Alert, AppState, Language } from '../reducers/app-slice'

// Root state type
import Store from '../Store'

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
