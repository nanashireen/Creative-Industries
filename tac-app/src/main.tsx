import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // This MUST point to the App.tsx you just edited
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)