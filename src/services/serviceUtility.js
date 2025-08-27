import { errorAlert, successAlert } from '../redux/reducers/app-slice'
import { signOut } from '../redux/reducers/user-slice'

export const onQueryStartedDefault = async (_id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    const error = err
    if (error?.error?.status === 401) {
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : 'Session expired, please sign in again !',
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message: error?.error?.data?.message || 'Error loading data',
        }),
      )
    }
  }
}

export const onQueryStarted = async (_id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    const error = err
    if (error?.error?.status === 401) {
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : 'Session expired, please sign in again !',
        }),
      )
    } else if (error?.error?.status !== 304) {
      dispatch(
        errorAlert({
          message: error?.error?.data?.message || 'Error loading data',
        }),
      )
    }
  }
}
export const onMutationStartedDefault = async (_data, { dispatch, queryFulfilled }) => {
  try {
    const res = await queryFulfilled
    if (
      res?.data &&
      typeof res.data === 'object' &&
      'message' in res.data &&
      typeof res.data.message === 'string'
    ) {
      dispatch(successAlert({ message: res.data.message }))
    }
  } catch (err) {
    const error = err
    if (error?.error?.status === 401) {
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : 'Session expired, please sign in again !',
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message: error?.error?.data?.message || 'Error completing request',
        }),
      )
    }
  }
}

export const onMutationStarted = async (_id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    const error = err
    if (error?.error?.status === 401) {
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : 'Session expired, please sign in again !',
        }),
      )
    }
  }
}
