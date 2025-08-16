import i18n from '../localization/i18n'
import { signOut } from '../redux/reducers/user-slice'
import { errorAlert, successAlert } from '../redux/reducers/app-slice'

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

export const onQueryStartedDefault = async (
  id,
  { dispatch, queryFulfilled },
) => {
  try {
    await queryFulfilled
    // `onSuccess` side-effect
  } catch (err) {
    // `onError` side-effect
    if (err?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else {
      dispatch(
        errorAlert({
          message:
            err?.error?.data?.message ||
            i18n.t('application:MISCELLANEOUS.ERROR_LOADING_DATA'),
        }),
      )
    }
  }
}

export const onQueryStarted = async (id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    if (err?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else if (err?.error?.status === NUMBER.FOUR_HUNDRED_THREE) {
      // if unauthorization error,logout user.
      if (err?.error?.data?.detail === commonConstant.UNAUTHORIZED_TEXT) {
        dispatch(signOut())
        if (localStorage.getItem('token')) {
          dispatch(
            errorAlert({
              message: i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
            }),
          )
        }
      }
    } else if (err?.error?.status !== 304) {
      dispatch(
        errorAlert({
          message:
            err?.error?.data?.message ||
            i18n.t('application:MISCELLANEOUS.ERROR_LOADING_DATA'),
        }),
      )
    }
  }
}
export const onMutationStartedDefault = async (
  data,
  { dispatch, queryFulfilled },
) => {
  try {
    const res = await queryFulfilled
    // `onSuccess` side-effect
    if (res?.data?.message) {
      dispatch(successAlert(res.data))
    }
  } catch (err) {
    if (err?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
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

export const onMutationStarted = async (id, { dispatch, queryFulfilled }) => {
  try {
    await queryFulfilled
  } catch (err) {
    if (err?.error?.status === 401) {
      // if unauthorization error,logout user.
      dispatch(signOut())
      dispatch(
        errorAlert({
          message: err?.error?.data?.message
            ? err?.error?.data?.message
            : i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
        }),
      )
    } else if (err?.error?.status === NUMBER.FOUR_HUNDRED_THREE) {
      // if unauthorization error,logout user.
      if (err?.error?.data?.detail === commonConstant.UNAUTHORIZED_TEXT) {
        dispatch(signOut())
        dispatch(
          errorAlert({
            message: i18n.t('application:MISCELLANEOUS.SESSION_EXPIRED'),
          }),
        )
      }
    } else if (err?.error?.status === NUMBER.FOUR_HUNDRED) {
      if (err?.error?.data?.detail === STATICTEXT.QUESTION_INVALID) {
        await dispatch(
          errorAlert({
            message: i18n.t('application:MISCELLANEOUS.ALREADY_SAVED'),
          }),
        )
      }
    } else if (err?.error?.message !== STATICTEXT.API_ABORTED) {
      dispatch(
        errorAlert({
          message:
            err?.error?.data?.message ||
            i18n.t('application:MISCELLANEOUS.ERROR_COMPLETING_REQUEST'),
        }),
      )
    }
  }
}
