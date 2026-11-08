// Keep the same shape as client/src/types/api.ts.
export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string | string[]; // validation errors come as an array
  timestamp: string;
  path: string;
};
