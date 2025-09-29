import { Link } from "react-router-dom";
import { FaHome, FaLock } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

export default function Unauthorized() {
  const { profile } = useAuth();

  const getHomeRoute = () => {
    if (!profile) return "/";
    
    switch (profile.role) {
      case "ADMIN":
        return "/admin";
      case "PKK":
        return "/pkk/admin";
      case "KARANG_TARUNA":
        return "/karang-taruna/admin";
      case "BPD":
        return "/bpd/admin";
      case "CONTRIBUTOR":
        return "/contributor";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaLock className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Akses Ditolak
          </h2>
          <p className="text-gray-500 mb-8">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
        
        <Link
          to={getHomeRoute()}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaHome />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}