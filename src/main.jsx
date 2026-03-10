// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )




import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactLenis>
)
