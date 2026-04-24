import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchData from "@/hooks/fetchData";

type User = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadUser = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    
    if (!storedToken) return;
    console.log("TOKEN :", storedToken)
    setToken(storedToken);

    try {
      const data = await fetchData("user/me", "GET", undefined, true);

        if (data?.user) {
        setUser(data.user);
        } else {
            logout();
        }
        } catch (error) {
            console.error(error);
    }
};

  const login = async (newToken: string) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
    await loadUser();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useCurrentUser must be inside UserProvider");
  }

  return context;
};