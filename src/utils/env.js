const getEnvVar = (viteKey, legacyKey) => {
  // Try Vite env first
  if (import.meta?.env?.[viteKey]) {
    return import.meta.env[viteKey]
  }
  // Fallback to process.env for compatibility
  if (typeof process !== 'undefined' && process.env?.[legacyKey]) {
    return process.env[legacyKey]
  }
  return ''
}

export const ENV = {
  // Required variables
  BASE_URL: getEnvVar('VITE_BASE_URL', 'REACT_APP_Base_Url'),
  AES_SECRET_KEY: getEnvVar('VITE_AES_SECRET_KEY', 'REACT_APP_AES_SECRET_KEY'),

  // Optional variables
  CDN: getEnvVar('VITE_CDN', 'REACT_APP_CDN'),
}

export default ENV
