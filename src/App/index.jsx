import './App.css'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'

import i18n from '../localization/i18n'
import Routes from '../routes'
import FloatingAlerts from '../shared/components/ui-elements/alerts'
import { theme } from '../theme'

const App = () => (
  <ThemeProvider theme={theme}>
    <I18nextProvider i18n={i18n}>
      <CssBaseline />
      <RouterProvider router={Routes} />
      <FloatingAlerts />
    </I18nextProvider>
  </ThemeProvider>
)

export default App
