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
    console.log('💾 Saving token:', { hasToken: !!token, rememberMe, tokenLength: token?.length });
    
    if (!token) {
      console.error('❌ Cannot save empty token!');
      return;
    }
    
    if (rememberMe) {
      localStorage.setItem('token', token);
      console.log('💾 Token saved to localStorage');
    } else {
      sessionStorage.setItem('token', token);
      console.log('💾 Token saved to sessionStorage');
    }
    
    // Verify immediately
    const saved = getToken();
    console.log('✅ Verification:', { saved: !!saved, matches: saved === token });
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
    try {
      const response = await UserApi.profile(i18n.language);
      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          setProfile(null);
        }
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }
      const responseBody = await response.json();
      setProfile(responseBody.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      removeToken();
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
    removeToken();
    setProfile(null);
  };

  useLayoutEffect(() => {
    if (getToken()) {
      fetchProfile();
    } else {
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
