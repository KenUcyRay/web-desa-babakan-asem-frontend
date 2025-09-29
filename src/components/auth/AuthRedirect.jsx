import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthRedirect({ children }) {
  const { profile, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Jika user sudah login dan mencoba akses halaman login/register
    if (profile && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
      // Redirect berdasarkan role
      switch (profile.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "PKK":
          navigate("/pkk/admin", { replace: true });
          break;
        case "KARANG_TARUNA":
          navigate("/karang-taruna/admin", { replace: true });
          break;
        case "BPD":
          navigate("/bpd/admin", { replace: true });
          break;
        case "CONTRIBUTOR":
          navigate("/contributor", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }
    }
  }, [profile, isLoading, isInitialized, navigate]);

  return children;
}