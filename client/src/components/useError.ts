import { useContext } from 'react';
import { ErrorContext, ErrorContextType } from './ErrorContext';

export function useError(): ErrorContextType {
  const values = useContext(ErrorContext);
  if (!values) {
    console.error('useError must be used inside ErrorProvider');
    // Will be logged as unexpected error
    throw 'Type of Error could not be provided.';
  }
  return values;
}
