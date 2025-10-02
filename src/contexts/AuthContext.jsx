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

  const logout = async (showAlert = true) => {
    const lang = localStorage.getItem("i18nextLng") || "id";
    const isEnglish = lang.startsWith("en");
    
    try {
      // Coba logout ke server, tapi jangan tunggu jika gagal
      const token = getToken();
      if (token) {
        const UserApi = await import('../libs/api/UserApi');
        await UserApi.UserApi.logout(i18n.language).catch(() => {
          // Ignore server logout error - token mungkin sudah expired
        });
      }
    } catch (error) {
      // Ignore any error
    }
    
    // Hapus token dari semua storage
    removeToken();
    
    // Reset profile state
    setProfile(null);
    setIsInitialized(true); // Keep initialized as true
    
    // Show success message if requested
    if (showAlert) {
      const { alertSuccess } = await import('../libs/alert');
      await alertSuccess(
        isEnglish ? "Successfully logged out." : "Berhasil keluar."
      );
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
