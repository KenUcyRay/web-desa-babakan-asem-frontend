import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useSecureLogout = () => {
  const { logout } = useAuth();

  const secureLogout = async (showAlert = true) => {
    try {
      // Use the improved logout from AuthContext
      await logout(showAlert);
    } catch (error) {
      console.error('Secure logout error:', error);
      
      // Fallback: force clear everything
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies if any
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Force redirect
      window.location.replace('/');
    }
  };

  return secureLogout;
};