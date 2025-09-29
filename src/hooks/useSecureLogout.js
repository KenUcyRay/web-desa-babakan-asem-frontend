import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useSecureLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const secureLogout = () => {
    // Clear all possible storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies if any
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Call logout from context
    logout();
    
    // Force navigation to home
    navigate("/", { replace: true });
    
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return secureLogout;
};