import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Unauthorized from "../pages/Unauthorized";

export default function ProtectedRoute({ children, requiredRole = null, allowedRoles = [] }) {
  const { profile, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Jika tidak ada profile (tidak login), redirect ke home
    if (!profile) {
      navigate("/", { replace: true });
      return;
    }

    // Jika ada requiredRole yang spesifik
    if (requiredRole && profile.role !== requiredRole) {
      setShowUnauthorized(true);
      return;
    }

    // Jika ada allowedRoles array
    if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
      setShowUnauthorized(true);
      return;
    }

    // Reset unauthorized state jika akses valid
    setShowUnauthorized(false);
  }, [profile, isLoading, isInitialized, navigate, requiredRole, allowedRoles]);

  // Loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jika tidak ada profile, jangan render children
  if (!profile) {
    return null;
  }

  // Jika unauthorized, tampilkan halaman 403
  if (showUnauthorized) {
    return <Unauthorized />;
  }

  // Jika ada requiredRole dan tidak sesuai
  if (requiredRole && profile.role !== requiredRole) {
    return <Unauthorized />;
  }

  // Jika ada allowedRoles dan tidak sesuai
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <Unauthorized />;
  }

  return children;
}