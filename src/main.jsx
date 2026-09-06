import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App'
import './styles/index.css'
import './styles/mobile.css'  // Add this line

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"
      richColors
      closeButton
      expand={false}
      duration={4000}
    />
  </React.StrictMode>
)