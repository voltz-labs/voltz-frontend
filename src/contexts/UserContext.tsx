import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useHandler } from "../hooks/useHandler";
import { UserProps } from "../models/User";
import { Loading } from "../pages/Loading";
import { wallet } from "../utils/wallet";

export interface UserContextProps {
  user: UserProps;
  disconnect: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps>({
  user: {
    address: "",
    publicKey: "",
    balance: 0,
    isAdmin: false,
    isWhitelisted: false,
  },
  disconnect: async () => {},
});

export interface UserContextProviderProps {
  user: UserProps;
}

export const UserContextProvider = ({
  children,
}: React.PropsWithChildren<UserContextProviderProps>) => {
  const { handler } = useHandler();

  const { user, setUser } = useAuth();

  const disconnect = handler(async () => {
    setUser(null);

    try {
      await wallet.clearActiveAccount();
    } catch (err) {
      console.error(err);
    }
  });

  if (!user) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, disconnect }}>
      {children}
    </UserContext.Provider>
  );
};
