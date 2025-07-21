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
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
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
    { to: "/admin/manage-bumdes", label: "Produk BUMDes", icon: <FaStore /> },
    { to: "/admin/manage-galery", label: "Galeri Desa", icon: <FaImage /> },
    { to: "/admin/manage-administrasi", label: "Administrasi", icon: <FaClipboardList /> },
    { to: "/admin/manage-pkk", label: "Program PKK", icon: <FaUsersCog /> },
    { to: "/admin/manage-anggota", label: "Struktur Organisasi", icon: <FaSitemap /> },
  ];

  const infografisSubmenu = [
    { to: "/admin/kelola-infografis/penduduk", label: "Penduduk", icon: <FaUserFriends /> },
    { to: "/admin/kelola-infografis/idm", label: "Indeks Desa Membangun", icon: <FaGlobeAsia /> },
    { to: "/admin/kelola-infografis/bansos", label: "Bantuan Sosial", icon: <FaHandshake /> },
    { to: "/admin/kelola-infografis/sdgs", label: "SDGs Desa", icon: <FaPeopleCarry /> },
  ];

  const pengaturan = [
    { to: "/admin/pengaturan/profil", label: "Profil", icon: <FaUsers /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col border-r z-50 font-[Poppins,sans-serif]">
      {/* LOGO + JUDUL */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <img src={logo} alt="Logo Desa" className="w-11 h-11 object-contain" />
        <div>
          <h1 className="font-bold text-green-700 leading-tight text-base">
            Desa Babakan
          </h1>
          <p className="text-xs text-gray-500">Panel Admin</p>
        </div>
      </div>

      {/* MENU UTAMA */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* DROPDOWN INFOGRAFIS */}
        <div>
          <button
            onClick={() => setOpenInfografis(!openInfografis)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition ${
              location.pathname.includes("/admin/kelola-infografis")
                ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaChartPie />
              <span>Kelola Infografis</span>
            </div>
            {openInfografis ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {/* SUBMENU */}
          {openInfografis && (
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {infografisSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
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

        {/* PENGATURAN */}
        <p className="text-xs text-gray-400 mt-5 mb-2 px-2 uppercase tracking-wide">
          Pengaturan
        </p>
        {pengaturan.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
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

        <hr className="my-4" />

        {/* KEMBALI & LOGOUT */}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
        >
          <FaArrowLeft /> Kembali ke Website
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-500 text-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
}
