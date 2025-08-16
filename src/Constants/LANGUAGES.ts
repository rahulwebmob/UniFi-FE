interface Language {
  code: string
  label: string
  value: string
  direction: 'ltr' | 'rtl'
}

interface LanguagesMap {
  ENGLISH: Language
  NEPALI: Language
}

const LANGUAGES: LanguagesMap = {
  ENGLISH: {
    code: 'en',
    label: 'English',
    value: 'ENGLISH',
    direction: 'ltr',
  },
  NEPALI: {
    code: 'ne',
    label: 'नेपाली',
    value: 'NEPALI',
    direction: 'ltr',
  },
} as const

export type { Language, LanguagesMap }
export default LANGUAGES
