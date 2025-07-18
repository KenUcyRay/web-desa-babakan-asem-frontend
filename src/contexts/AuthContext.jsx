import { createContext, useContext } from "react";
import { useLocalStorage } from "react-use";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [admin, setAdmin] = useLocalStorage("admin", false);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  const isLoggedIn = !!token;
  const isAdmin = !!admin;
  const setAdminStatus = (status) => setAdmin(status);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isLoggedIn, isAdmin, setAdminStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
