const getEnvVar = (viteKey, legacyKey) => {
  if (import.meta?.env && viteKey in import.meta.env) {
    return import.meta.env[viteKey]
  }
  // Fallback to process.env for compatibility
  if (
    typeof process !== 'undefined' &&
    process.env &&
    legacyKey in process.env
  ) {
    return process.env[legacyKey]
  }
  return ''
}

export const ENV = {
  BASE_URL: getEnvVar('VITE_BASE_URL', 'REACT_APP_Base_Url'),
  ZOOM_CLIENT_ID: getEnvVar('VITE_ZOOM_CLIENT_ID', 'REACT_APP_ZOOM_CLIENT_ID'),
  COINROUTES_API_KEY: getEnvVar(
    'VITE_COINROUTES_API_KEY',
    'REACT_APP_COINROUTES_API_KEY',
  ),
  SQUAWK_KEY: getEnvVar('VITE_SQUAWK_KEY', 'REACT_APP_Squawk_Key'),
  SQUAWK_VALUE: getEnvVar('VITE_SQUAWK_VALUE', 'REACT_APP_Squawk_Value'),
  TWITTER_CLIENT_ID: getEnvVar(
    'VITE_TWITTER_CLIENT_ID',
    'REACT_APP_TWITTER_CLIENT_ID',
  ),
  AES_SECRET_KEY: getEnvVar('VITE_AES_SECRET_KEY', 'REACT_APP_AES_SECRET_KEY'),
  CDN: getEnvVar('VITE_CDN', 'REACT_APP_CDN'),
  PUBLIC_PATH: getEnvVar('VITE_PUBLIC_PATH', 'REACT_APP_PUBLIC_PATH'),
  GOOGLE_CLIENT_ID: getEnvVar(
    'VITE_GOOGLE_CLIENT_ID',
    'REACT_APP_GOOGLE_CLIENT_ID',
  ),
  LINKEDIN_CLIENT_ID: getEnvVar(
    'VITE_LINKEDIN_CLIENT_ID',
    'REACT_APP_LINKEDIN_CLIENT_ID',
  ),
  BOOK_CALL_SECRET: getEnvVar(
    'VITE_BOOK_CALL_SECRET',
    'REACT_APP_BOOK_CALL_SECRET',
  ),
}

export default ENV
