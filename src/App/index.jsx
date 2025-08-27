import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider } from 'react-router-dom'

import Routes from '../routes'
import FloatingAlerts from '../shared/components/ui-elements/alerts'
import { theme } from '../theme'

const App = () => (
  <ThemeProvider theme={theme}>
    <>
      <CssBaseline />
      <RouterProvider router={Routes} />
      <FloatingAlerts />
    </>
  </ThemeProvider>
)

export default App
