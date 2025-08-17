import { ja } from 'date-fns/locale/ja'
import { de } from 'date-fns/locale/de'
import { fr } from 'date-fns/locale/fr'
import { es } from 'date-fns/locale/es'
import { arSA } from 'date-fns/locale/ar-SA'
import { enUS } from 'date-fns/locale/en-US'
import { forwardRef } from 'react'
import { useSelector } from 'react-redux'

import { Box } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const LOCALE_TEXT = {
  ENGLISH: enUS,
  JAPANESE: ja,
  GERMAN: de,
  FRENCH: fr,
  ARABIC: arSA,
  SPANISH: es,
}

interface DatePickerProps {
  readOnly?: boolean | { slotProps: { textField: { readOnly: boolean } } }
  [key: string]: unknown
}

interface AppState {
  language?: {
    value?: string
  }
}

interface RootState {
  app: AppState
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (props, ref) => {
    const { readOnly } = props
    const isReadOnly =
      readOnly !== undefined
        ? readOnly
        : {
            slotProps: {
              textField: {
                readOnly: true,
              },
            },
          }

    const { language } = useSelector((state: RootState) => state.app)
    const selectedLanguage = language?.value || 'ENGLISH'

    return (
      <Box
        sx={{
          'input[type=text]:focus, input[type=text]': {
            outline: 'none !important',
          },
          'div.MuiInputBase-root': {
            fontSize: '0.813em',
          },
          'input.MuiOutlinedInput-input': {
            paddingRight: '0',
          },
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={
            LOCALE_TEXT[selectedLanguage as keyof typeof LOCALE_TEXT]
          }
        >
          <MuiDatePicker {...props} inputRef={ref} {...isReadOnly} />
        </LocalizationProvider>
      </Box>
    )
  },
)

export default DatePicker
