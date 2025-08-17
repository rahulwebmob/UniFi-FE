import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { forwardRef, useImperativeHandle } from 'react'

import {
  Box,
  Radio,
  alpha,
  useTheme,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material'

import LANGUAGES, { type Language } from '../../../../../constants/languages'
import { updateLanguage } from '../../../../../redux/reducers/app-slice'

interface AppState {
  language: Language
}

interface RootState {
  app: AppState
}

interface UserSettingsRef {
  handleExecute: () => void
}

const UserSettings = forwardRef<UserSettingsRef>((_, userSettingsRef) => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()
  const { language } = useSelector((state: RootState) => state.app)

  const handleLanguageChange = (lang: Language) => {
    if (lang) {
      void dispatch(updateLanguage(lang))
    }
  }

  useImperativeHandle(userSettingsRef, () => ({
    handleExecute: () => {
      // Language is updated immediately on change
    },
  }))

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2.5,
          color: theme.palette.text.primary,
        }}
      >
        {t('application:PROFILE.LANGUAGE_PREFERENCES')}
      </Typography>

      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {t('application:PROFILE.SELECT_PREFERRED_LANGUAGE')}
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            name="language-settings"
            value={language?.code}
            sx={{
              '& .MuiFormControlLabel-root': {
                mb: 1,
                p: 1.5,
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
              '& .Mui-checked': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {Object.values(LANGUAGES).map((item) => (
              <FormControlLabel
                key={item.code}
                value={item.code}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: theme.palette.text.secondary,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: language?.code === item.code ? 600 : 400,
                        color:
                          language?.code === item.code
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                      }}
                    >
                      {item.label}
                    </Typography>
                    {language?.code === item.code && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        ({t('application:COMMON.CURRENT')})
                      </Typography>
                    )}
                  </Box>
                }
                onChange={() => handleLanguageChange(item)}
                sx={{
                  width: '100%',
                  m: 0,
                  backgroundColor:
                    language?.code === item.code
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                  borderRadius: '8px',
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 2,
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
        >
          {t('application:PROFILE.LANGUAGE_CHANGE_APPLIED_IMMEDIATELY')}
        </Typography>
      </Box>
    </>
  )
})

export default UserSettings
