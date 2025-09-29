import { createContext, useContext, useState, useLayoutEffect } from "react";
import { UserApi } from "../libs/api/UserApi"; // Sesuaikan dengan path API Anda
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { i18n } = useTranslation();

  const saveToken = (token, rememberMe = false) => {
    if (!token) return;
    
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    const token = getToken();
    
    if (!token) {
      setProfile(null);
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }
    
    try {
      const response = await UserApi.profile(i18n.language);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setProfile(null);
        }
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }
      
      const responseBody = await response.json();
      setProfile(responseBody.data);
    } catch (error) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setProfile(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = (userData, token, rememberMe = false) => {
    saveToken(token, rememberMe);
    setProfile(userData);
  };

  const logout = () => {
    // Hapus token dari semua storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Clear semua localStorage dan sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset profile state
    setProfile(null);
    setIsInitialized(false);
    
    // Force redirect dan reload
    window.location.replace('/');
  };

  useLayoutEffect(() => {
    const token = getToken();
    
    if (token) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [i18n.language]);

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        isInitialized,
        refetchProfile: fetchProfile,
        login,
        logout,
        getToken,
        saveToken,
        removeToken,
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
