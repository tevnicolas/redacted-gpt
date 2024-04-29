import { useContext } from 'react';
import { UserContext, UserContextType } from './UserContext';

export function useUser(): UserContextType {
  const values = useContext(UserContext);
  if (!values) {
    console.error('useUser must be used inside UserProvider');
    // Will be logged as unexpected error
    throw 'Account could not be reached.';
  }
  return values;
}
