import { createContext } from 'react';

export type User = {
  userId: number;
  username: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | null;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};
export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: null,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

export const UserProvider = UserContext.Provider;
