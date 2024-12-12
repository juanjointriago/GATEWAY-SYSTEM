import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
// console.log(import.meta.env.VITE_APIKEY) 
// console.log('✅',import.meta.env.VITE_COLLECTION_USERS)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
