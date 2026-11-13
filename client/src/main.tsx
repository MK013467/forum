import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import router from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import RootErrorPage from './components/error/RootErrorPage.tsx';
import { ToastContainer, toast } from 'react-toastify';
import { getApiErrorMessage } from './api';

const quryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || error.message);
    },
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorPage}>
      <ToastContainer position="bottom-center" autoClose={2000} theme="light" />
      <QueryClientProvider client={quryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
