import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.tsx';
import { RouterProvider } from 'react-router-dom';





createRoot(document.getElementById('root')!).render(
  // <div style={{ padding: 24, fontSize: 24 }}>HELLO</div>

  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
