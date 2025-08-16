import './App.css'

import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import Routes from '../routes'
import { theme } from '../theme'
import i18n from '../localization/i18n'
import FloatingAlerts from '../shared/components/ui-elements/alerts'

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <I18nextProvider i18n={i18n}>
      <CssBaseline />
      <RouterProvider router={Routes} />
      <FloatingAlerts />
    </I18nextProvider>
  </ThemeProvider>
)

export default App
