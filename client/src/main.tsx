import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import RootErrorPage from './components/error/RootErrorPage.tsx';





const quryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // <div style={{ padding: 24, fontSize: 24 }}>HELLO</div>

  <StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorPage}>
    <QueryClientProvider client={quryClient}>
    <RouterProvider router={router}/>
    </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
