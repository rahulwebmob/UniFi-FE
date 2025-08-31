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
import { useDispatch, useSelector } from 'react-redux'

import LANGUAGES from '../../../../../constants/languages'
import { updateLanguage } from '../../../../../redux/reducers/app-slice'

const AppSettings = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { language } = useSelector((state) => state.app)

  const handleLanguageChange = (lang) => {
    if (lang) {
      dispatch(updateLanguage(lang))
    }
  }

  return (
    <>
      <Typography variant="h6" mb={2.5}>
        Language Preferences
      </Typography>

      <Box>
        <Typography variant="body2" mb={1.5} color="text.secondary" fontWeight={500}>
          Select your preferred language
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
                        (Current)
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
          Language changes will be applied immediately
        </Typography>
      </Box>
    </>
  )
}

export default AppSettings
