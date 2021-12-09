import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ScopedCssBaseline } from '@mui/material'

ReactDOM.render(
  <React.StrictMode>
    <ScopedCssBaseline>
      <App />
    </ScopedCssBaseline>
  </React.StrictMode>,
  document.getElementById('root'),
)
