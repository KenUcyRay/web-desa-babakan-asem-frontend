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
          // Token expired atau tidak valid, hapus dan logout silent
          console.warn('Token expired, clearing authentication');
          removeToken();
          setProfile(null);
        } else {
          console.error('Profile fetch failed:', response.status, response.statusText);
        }
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }
      
      const responseBody = await response.json();
      setProfile(responseBody.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Only remove token if it's a network/auth error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        console.warn('Network error, keeping token for retry');
      } else {
        removeToken();
      }
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

  const logout = async (showAlert = true) => {
    const lang = localStorage.getItem("i18nextLng") || "id";
    const isEnglish = lang.startsWith("en");
    
    try {
      // Coba logout ke server, tapi jangan tunggu jika gagal
      const token = getToken();
      if (token) {
        const response = await UserApi.logout(i18n.language);
        if (!response.ok && response.status !== 401) {
          console.warn('Server logout failed:', response.status);
        }
      }
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    }
    
    // Hapus token dari semua storage
    removeToken();
    
    // Reset profile state
    setProfile(null);
    setIsInitialized(true);
    
    // Show success message if requested
    if (showAlert) {
      try {
        const { alertSuccess } = await import('../libs/alert');
        await alertSuccess(
          isEnglish ? "Successfully logged out." : "Berhasil keluar."
        );
      } catch (error) {
        console.warn('Alert failed:', error);
      }
    }
    
    // Force redirect
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
