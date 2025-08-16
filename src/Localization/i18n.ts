import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import locales from './locales'

i18n.use(initReactI18next).init({
  ...locales,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['application', 'modules', 'education'],
  defaultNS: 'application',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
