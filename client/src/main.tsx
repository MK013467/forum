import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import RootErrorPage from './components/error/RootErrorPage.tsx';





const quryClient = new QueryClient({mutationCache: new MutationCache({
  onError: (error: any) => {
    alert(`에러가 발생했습니다: ${error.response?.data?.message || error.message}`);
  },
})});

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorPage}>
    <QueryClientProvider client={quryClient}>
    <RouterProvider router={router}/>
    </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
