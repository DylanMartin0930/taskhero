import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface UserContextType {
  userData: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUserData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get("/api/users/me");
      setUserData(response.data.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, isLoading, isError, refetch: fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
