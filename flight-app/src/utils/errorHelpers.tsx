import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type PossibleError = Partial<FetchBaseQueryError> & Partial<{ message: string }>;

export function errorHandler(error: PossibleError): string {
  if (!error) return 'Unknown error';

  if ('status' in error) {
    if (typeof error.data === 'string') {
      return error.data;
    }
    if (error.data && typeof error.data === 'object') {
      return (error.data as any).message || JSON.stringify(error.data);
    }
    return `Error status: ${error.status}`;
  }

  return error.message || 'Unknown error occurred';
}
