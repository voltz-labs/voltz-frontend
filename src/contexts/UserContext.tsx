import React from "react";
import { UserProps } from "../models/User";

export interface UserContextProps {
  user: UserProps;
  disconnect: (user: UserProps) => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps>({
  user: {
    address: "",
    publicKey: "",
    balance: 0,
  },
  disconnect: async () => {},
});

export interface UserContextProviderProps {
  user: UserProps;
  disconnect: (user: UserProps) => Promise<void>;
}

export const UserContextProvider = ({
  user,
  disconnect,
  children,
}: React.PropsWithChildren<UserContextProviderProps>) => {
  return (
    <UserContext.Provider value={{ user, disconnect }}>
      {children}
    </UserContext.Provider>
  );
};
