import { createContext, useContext, useState, useLayoutEffect } from "react";
import { UserApi } from "../libs/api/UserApi"; // Sesuaikan dengan path API Anda
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { i18n } = useTranslation(); // Pastikan i18n diimport dari react-i18next

  const fetchProfile = async () => {
    setIsLoading(true);
    const response = await UserApi.profile(i18n.language);
    if (!response.ok) {
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }
    const responseBody = await response.json();
    setProfile(responseBody.data);
    setIsLoading(false);
    setIsInitialized(true);
  };

  useLayoutEffect(() => {
    fetchProfile();
  }, [i18n.language]);

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        isInitialized,
        refetchProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
