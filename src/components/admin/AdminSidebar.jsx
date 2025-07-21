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
  FaClipboardList,
  FaUsersCog,
  FaChartPie,
  FaUserFriends,
  FaHandshake,
  FaGlobeAsia,
  FaPeopleCarry,
} from "react-icons/fa";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, setAdminStatus } = useAuth();

  const [openInfografis, setOpenInfografis] = useState(false);

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

    // ✅ Menu baru untuk Administrasi
    {
      to: "/admin/manage-administrasi",
      label: "Kelola Administrasi",
      icon: <FaClipboardList />,
    },

    // ✅ Menu baru untuk Program PKK
    {
      to: "/admin/manage-pkk",
      label: "Kelola Program PKK",
      icon: <FaUsersCog />,
    },

    // ✅ Menu baru untuk struktur organisasi
    {
      to: "/admin/manage-anggota",
      label: "Struktur Organisasi",
      icon: <FaSitemap />,
    },
  ];

  // ✅ Dropdown Kelola Infografis
  const infografisSubmenu = [
    {
      to: "/admin/kelola-infografis/penduduk",
      label: "Penduduk",
      icon: <FaUserFriends />,
    },
    {
      to: "/admin/kelola-infografis/idm",
      label: "Indeks Desa Membangun",
      icon: <FaGlobeAsia />,
    },
    {
      to: "/admin/kelola-infografis/bansos",
      label: "Bantuan Sosial",
      icon: <FaHandshake />,
    },
    {
      to: "/admin/kelola-infografis/sdgs",
      label: "SDGs Desa",
      icon: <FaPeopleCarry />,
    },
  ];

  const pengaturan = [
    { to: "/admin/pengaturan/profil", label: "Profil", icon: <FaUsers /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col border-r z-50">
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
        {/* Menu Utama */}
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

        {/* ✅ Dropdown Kelola Infografis */}
        <div>
          <button
            onClick={() => setOpenInfografis(!openInfografis)}
            className={`flex items-center justify-between w-full p-2 rounded-md transition ${
              location.pathname.includes("/admin/kelola-infografis")
                ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaChartPie />
              <span>Kelola Infografis</span>
            </div>
            <span className="text-sm">{openInfografis ? "▲" : "▼"}</span>
          </button>

          {openInfografis && (
            <div className="ml-6 mt-1 space-y-1">
              {infografisSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      isActive
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "hover:bg-green-50 text-gray-700"
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

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
