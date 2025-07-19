import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaEnvelope,
  FaUsers,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, setAdminStatus } = useAuth();

  const handleLogout = async () => {
    const confirm = await alertConfirm("Apakah Anda yakin ingin keluar?");

    if (!confirm) {
      return;
    }
    setAdminStatus(false);
    logout();
    await alertSuccess("Anda telah keluar.");
  };

  const menu = [
    { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      to: "/admin/manage-berita",
      label: "Kelola Berita",
      icon: <FaNewspaper />,
    },
    {
      to: "/admin/manage-agenda",
      label: "Kelola Agenda",
      icon: <FaCalendarAlt />,
    },
    { to: "/admin/manage-pesan", label: "Kelola Pesan", icon: <FaEnvelope /> },
    { to: "/admin/manage-user", label: "Kelola User", icon: <FaUsers /> },
  ];

  const pengaturan = [
    {
      to: "/admin/pengaturan/profil",
      label: "Profil",
      icon: <FaUsers />,
    },
    {
      to: "/admin/pengaturan/hak-akses",
      label: "Hak Akses",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col">
      {/* Logo + Judul */}
      <div className="flex items-center gap-2 p-4 border-b">
        <img src={logo} alt="Logo" className="w-10" />
        <span className="font-bold text-lg text-green-600">
          Desa Babakan - Admin
        </span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 p-2 rounded hover:bg-green-100 ${
              location.pathname === item.to ? "bg-green-200 font-semibold" : ""
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <p className="text-xs text-gray-500 mt-4 mb-2">PENGATURAN</p>
        {pengaturan.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 p-2 rounded hover:bg-green-100 ${
              location.pathname === item.to ? "bg-green-200 font-semibold" : ""
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <hr className="my-3" />

        {/* Back & Logout */}
        <Link
          to="/"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-200"
        >
          <FaArrowLeft /> Kembali ke Website
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 w-full text-left rounded hover:bg-red-100 text-red-500"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
}
