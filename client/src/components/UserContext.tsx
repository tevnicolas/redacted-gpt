import { createContext } from 'react';

export type User = {
  userId: number;
  username: string;
};

export type UserContextType = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};
export const UserContext = createContext<UserContextType>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

export const UserProvider = UserContext.Provider;
