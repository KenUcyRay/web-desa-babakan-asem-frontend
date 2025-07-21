import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaEnvelope,
  FaUsers,
  FaSignOutAlt,
  FaArrowLeft,
  FaStore,
  FaImage,
  FaSitemap, 
  FaClipboardList // ✅ icon untuk Administrasi
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, setAdminStatus } = useAuth();

  const handleLogout = async () => {
    const confirm = await alertConfirm("Apakah Anda yakin ingin keluar?");
    if (!confirm) return;

    setAdminStatus(false);
    logout();
    await alertSuccess("Anda telah keluar.");
  };

  const menu = [
    { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin/manage-berita", label: "Kelola Berita", icon: <FaNewspaper /> },
    { to: "/admin/manage-agenda", label: "Kelola Agenda", icon: <FaCalendarAlt /> },
    { to: "/admin/manage-pesan", label: "Kelola Pesan", icon: <FaEnvelope /> },
    { to: "/admin/manage-user", label: "Kelola User", icon: <FaUsers /> },
    { to: "/admin/manage-bumdes", label: "Kelola Produk BUMDes", icon: <FaStore /> },
    { to: "/admin/manage-galery", label: "Kelola Galeri Desa", icon: <FaImage /> },
    { to: "/admin/manage-form", label: "Kelola Form Diterima", icon: <FaImage /> },

    // ✅ Menu baru untuk Administrasi (Form Online, Formulir Layanan, Surat Pengantar)
    {
      to: "/admin/manage-administrasi",
      label: "Kelola Administrasi",
      icon: <FaClipboardList />,
    },

    // ✅ Tambahan menu baru untuk struktur organisasi
    {
      to: "/admin/manage-anggota",
      label: "Struktur Organisasi",
      icon: <FaSitemap />,
    },
  ];

  const pengaturan = [
    { to: "/admin/pengaturan/profil", label: "Profil", icon: <FaUsers /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col border-r">
      {/* ✅ Logo + Judul */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <img src={logo} alt="Logo Desa" className="w-10 h-10 object-contain" />
        <span className="font-bold text-base text-green-700 leading-tight">
          Desa Babakan <br />
          <span className="text-sm text-gray-500">Panel Admin</span>
        </span>
      </div>

      {/* ✅ Menu Navigasi */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                  : "hover:bg-green-50 text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* ✅ Submenu Pengaturan */}
        <p className="text-xs text-gray-500 mt-4 mb-1 px-2">PENGATURAN</p>
        {pengaturan.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                  : "hover:bg-green-50 text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        <hr className="my-3" />

        {/* ✅ Back & Logout */}
        <Link
          to="/"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-gray-700"
        >
          <FaArrowLeft /> Kembali ke Website
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 w-full text-left rounded hover:bg-red-50 text-red-500"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
}
