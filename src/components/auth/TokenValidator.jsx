import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function TokenValidator({ children }) {
  const { profile, isInitialized, getToken } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;

    const token = getToken();
    
    // Jika ada token tapi tidak ada profile, berarti token invalid
    if (token && !profile) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }, [profile, isInitialized, getToken]);

  return children;
}