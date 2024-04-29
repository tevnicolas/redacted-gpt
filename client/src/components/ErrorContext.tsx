import { createContext } from 'react';

export type ErrorContextType = {
  error: unknown;
  setError: (error: unknown) => void;
};

export const ErrorContext = createContext<ErrorContextType>({
  error: undefined,
  setError: () => undefined,
});

export const ErrorProvider = ErrorContext.Provider;
