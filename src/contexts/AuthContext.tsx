import React, { useEffect, useState } from "react";
import { getTezosBalance } from "../functions/getTezosBalance";
import { gql } from "../functions/gql";
import { graphql } from "../functions/graphql";
import { useHandler } from "../hooks/useHandler";
import { UserProps } from "../models/User";
import { LOCAL_STORAGE_USER_KEY } from "../utils/constants";
import { GraphQLError } from "../utils/GraphQLError";
import { wallet } from "../utils/wallet";

export interface MutationUserConnect {
  userConnect: {
    address: string;
    publicKey: string;
    isAdmin: boolean;
    isWhitelisted: boolean;
  };
}

export interface MutationUserConnectVariables {
  input: {
    address: string;
    publicKey: string;
  };
}

export const MUTATION_USER_CONNECT = gql`
  mutation ($input: UserConnectInput!) {
    userConnect(input: $input) {
      address
      publicKey
      isAdmin
      isWhitelisted
    }
  }
`;

export interface AuthContextProps {
  loading: boolean;
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
  connect: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  loading: true,
  user: null,
  setUser: () => {},
  connect: async () => {},
});

export const AuthContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(true);
  const [user, _setUser] = useState<UserProps | null>(null);

  const setUser = (user: UserProps | null) => {
    if (!user) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    }
    _setUser(user);
  };

  const fetchStorage = () => {
    setLoading(true);

    try {
      const item = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

      if (!item) {
        setUser(null);
        return;
      }

      try {
        const user = JSON.parse(item);

        if (user) {
          setUser(user);

          // update balance
          getTezosBalance(user.address).then((balance) => {
            setUser({
              ...user,
              balance,
            });
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const { handler } = useHandler();

  const connect = handler(async () => {
    const permissions = await wallet.client.requestPermissions();

    if (permissions) {
      const { data, errors } = await graphql<
        MutationUserConnect,
        MutationUserConnectVariables
      >({
        query: MUTATION_USER_CONNECT,
        variables: {
          input: {
            address: permissions.address,
            publicKey: permissions.publicKey,
          },
        },
      });

      if (errors) {
        throw new GraphQLError("Failed to connect wallet", errors);
      }

      const balance = await getTezosBalance(permissions.address);

      setUser({
        address: permissions.address,
        publicKey: permissions.publicKey,
        balance,
        isAdmin: data.userConnect.isAdmin,
        isWhitelisted: data.userConnect.isWhitelisted,
      });
    }
  });

  useEffect(() => {
    fetchStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, connect }}>
      {children}
    </AuthContext.Provider>
  );
};
