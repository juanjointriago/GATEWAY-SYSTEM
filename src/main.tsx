import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
import { Toaster } from 'sonner';
// console.debug(import.meta.env.VITE_APIKEY) 
// console.debug('✅',import.meta.env.VITE_COLLECTION_USERS)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
