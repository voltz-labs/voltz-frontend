import React, { useEffect, useState } from "react";
import { UserProps } from "../models/User";
import { LOCAL_STORAGE_USER_KEY } from "../utils/constants";

export interface AuthContextProps {
  loading: boolean;
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  loading: true,
  user: null,
  setUser: () => {},
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

  useEffect(() => {
    fetchStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
