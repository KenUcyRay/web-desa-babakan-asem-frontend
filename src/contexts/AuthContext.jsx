import { createContext, useContext } from "react";
import { useLocalStorage } from "react-use";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
