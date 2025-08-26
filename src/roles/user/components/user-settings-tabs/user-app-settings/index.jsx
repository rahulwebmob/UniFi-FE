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
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import LANGUAGES from '../../../../../constants/languages'
import { updateLanguage } from '../../../../../redux/reducers/app-slice'

const AppSettings = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()
  const { language } = useSelector((state) => state.app)

  const handleLanguageChange = (lang) => {
    if (lang) {
      void dispatch(updateLanguage(lang))
    }
  }

  return (
    <>
      <Typography variant="h6" fontWeight={600} mb={2.5}>
        {t('application:PROFILE.LANGUAGE_PREFERENCES')}
      </Typography>

      <Box>
        <Typography variant="body2" mb={1.5} color="text.secondary" fontWeight={500}>
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
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      fontWeight={language?.code === item.code ? 600 : 400}
                      color={language?.code === item.code ? 'text.primary' : 'text.secondary'}
                    >
                      {item.label}
                    </Typography>
                    {language?.code === item.code && (
                      <Typography variant="caption" color="primary" fontWeight={600}>
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
          display="block"
          mt={2}
          color="text.secondary"
          fontStyle="italic"
        >
          {t('application:PROFILE.LANGUAGE_CHANGE_APPLIED_IMMEDIATELY')}
        </Typography>
      </Box>
    </>
  )
}

export default AppSettings
