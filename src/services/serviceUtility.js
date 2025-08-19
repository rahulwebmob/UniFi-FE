import i18n from '../localization/i18n'
import { errorAlert, successAlert } from '../redux/reducers/app-slice'
import { signOut } from '../redux/reducers/user-slice'

// Constants for status codes and error handling
const NUMBER = { ZERO: 0, ONE: 1, FOUR_HUNDRED: 400, FOUR_HUNDRED_THREE: 403 }
const STATICTEXT = {
  AI_MODULE: 'ai_module',
  QUESTION_INVALID: 'question_invalid',
  API_ABORTED: 'api_aborted',
}
const commonConstant = {
  REQUEST_ALERT_DISPLAY_TIME: 3000,
  UNAUTHORIZED_TEXT: 'Unauthorized',
}

export const onQueryStartedDefault = async (_id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
    // `onSuccess` side-effect
  } catch (err) {
    // `onError` side-effect
    const error = err
    if (error?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message:
            error?.error?.data?.message || i18n.t('application:MISCELLANEOUS.ERROR_LOADING_DATA'),
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
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else if (error?.error?.status === NUMBER.FOUR_HUNDRED_THREE) {
      // if unauthorization error,logout user.
      if (error?.error?.data?.detail === commonConstant.UNAUTHORIZED_TEXT) {
        dispatch(signOut())
        if (localStorage.getItem('token')) {
          dispatch(
            errorAlert({
              message: i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
            }),
          )
        }
      }
    } else if (error?.error?.status !== 304) {
      dispatch(
        errorAlert({
          message:
            error?.error?.data?.message || i18n.t('application:MISCELLANEOUS.ERROR_LOADING_DATA'),
        }),
      )
    }
  }
}
export const onMutationStartedDefault = async (_data, { dispatch, queryFulfilled }) => {
  try {
    const res = await queryFulfilled
    // `onSuccess` side-effect
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
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
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
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: error?.error?.data?.message
            ? error?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else if (error?.error?.status === NUMBER.FOUR_HUNDRED_THREE) {
      // if unauthorization error,logout user.
      if (error?.error?.data?.detail === commonConstant.UNAUTHORIZED_TEXT) {
        dispatch(signOut())
        dispatch(
          errorAlert({
            message: i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
          }),
        )
      }
    } else if (error?.error?.status === NUMBER.FOUR_HUNDRED) {
      if (error?.error?.data?.detail === STATICTEXT.QUESTION_INVALID) {
        dispatch(
          errorAlert({
            message: i18n.t('application:MISCELLANEOUS.ALREADY_SAVED'),
          }),
        )
      }
    } else if (error?.error?.message !== STATICTEXT.API_ABORTED) {
      dispatch(
        errorAlert({
          message:
            error?.error?.data?.message ||
            i18n.t('application:MISCELLANEOUS.ERROR_COMPLETING_REQUEST'),
        }),
      )
    }
  }
}
