import { errorAlert, successAlert } from '../redux/reducers/app-slice'
import { signOut } from '../redux/reducers/user-slice'

export const onQueryStarted = async (id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    if (err?.error?.status === 401) {
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : 'Your session has expired. Please log in again.',
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message: err?.error?.data?.message || 'Error loading data',
        }),
      )
    }
  }
}

export const onMutationStarted = async (data, { dispatch, queryFulfilled }) => {
  try {
    const res = await queryFulfilled
    if (res?.data?.message) {
      dispatch(successAlert({ message: res.data.message }))
    }
  } catch (err) {
    if (err?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : 'Your session has expired. Please log in again.',
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message: err?.error?.data?.message || 'Error completing request',
        }),
      )
    }
  }
}
