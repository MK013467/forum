import axios from 'axios';
import type { ApiErrorResponse } from './types/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(
  (response) => {
    return {
      ...response,
      data: response.data.data,
    };
  },
  (err) => {
    return Promise.reject(err);
  },
);

// Message from the server's error body, if the error came from axios.
export const getApiErrorMessage = (err: unknown): string | undefined => {
  if (!axios.isAxiosError<Partial<ApiErrorResponse>>(err)) return undefined;
  const message = err.response?.data?.message;
  return Array.isArray(message) ? message.join(', ') : message;
};
