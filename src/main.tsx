import './localization/i18n'
import './index.css'

import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

import App from './app'
import Store from './redux/store'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

reportWebVitals()
