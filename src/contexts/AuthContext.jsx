import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "react-use";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [admin, setAdmin] = useLocalStorage("admin", false);
  const [role, setRole] = useLocalStorage("role", null);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  const isLoggedIn = !!token;
  const isAdmin = !!admin;
  const setAdminStatus = (status) => setAdmin(status);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isLoggedIn,
        isAdmin,
        setAdminStatus,
        role,
        setRole,
        profile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
