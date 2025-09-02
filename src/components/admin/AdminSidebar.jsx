import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaStar,
  FaTasks,
  FaMoneyCheckAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle // Ikon baru untuk informasi darurat
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsDatabaseFillLock } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess, alertError } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";
import { Helper } from "../../utils/Helper";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { setProfile } = useAuth();
  const [openInfografis, setOpenInfografis] = useState(false);
  const [openManagePublik, setOpenManagePublik] = useState(false);
  const [openManageInformasi, setOpenManageInformasi] = useState(false);
  const [openManageOrganisasi, setOpenManageOrganisasi] = useState(false);

  // State untuk waktu saat ini
  const [currentTime, setCurrentTime] = useState(new Date());

  // - supaya sidebar mobile gak langsung hilang
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300); // sesuai durasi animasi

    // Update waktu setiap detik
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Format waktu menjadi string: "HH:MM:SS"
  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format tanggal menjadi string: "Hari, DD MMMM YYYY"
  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    const confirm = await alertConfirm("Apakah Anda yakin ingin keluar?");
    if (!confirm) return;
    const response = await UserApi.logout(i18n.language);
    if (!response.ok) {
      Helper.errorResponseHandler(await response.json());
      return;
    }
    setProfile(null);
    await alertSuccess("Anda telah keluar.");
    navigate("/login");
  };

  const menu = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    // Menu Informasi Darurat - DITAMBAHKAN DI SINI
    {
      to: "/admin/emergency-page",
      label: "Informasi Darurat",
      icon: <FaExclamationTriangle />,
      isEmergency: true // Flag khusus untuk menu darurat
    },
    // TOMBOL DATA MASTER SATUAN
    {
      to: "/admin/data-master",
      label: "Data Master",
      icon: <BsDatabaseFillLock />,
    },
  ];

  const managePublikSubmenu = [
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
    {
      to: "/admin/manage-galery",
      label: "Galeri Desa",
      icon: <FaImage />,
    },
    {
      to: "/admin/manage-anggota",
      label: "Struktur Organisasi",
      icon: <FaSitemap />,
    },
    {
      to: "/admin/manage-prestasi",
      label: "Kelola Prestasi",
      icon: <FaStar />,
    },
    {
      to: "/admin/manage-program",
      label: "Kelola Program",
      icon: <FaTasks />,
    },
    {
      to: "/admin/manage-apb",
      label: "Kelola APB",
      icon: <FaMoneyCheckAlt />,
    },
  ];

  const manageDataSubmenu = [
    {
      to: "/admin/manage-user",
      label: "Kelola Pengguna",
      icon: <FaUsers />,
    },
    {
      to: "/admin/manage-pesan",
      label: "Kelola Pesan",
      icon: <FaEnvelope />,
    },
    {
      to: "/admin/manage-administrasi",
      label: "Administrasi",
      icon: <FaClipboardList />,
    },
  ];

  const manageOrganisasiSubmenu = [
    {
      to: "/admin/manage-pkk",
      label: "Program PKK",
      icon: <FaUsersCog />,
    },
    {
      to: "/admin/manage-bumdes",
      label: "Produk BUMDes",
      icon: <FaStore />,
    },
  ];

  const infografisSubmenu = [
    {
      to: "/admin/kelola-infografis/penduduk",
      label: "Data Penduduk",
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
    {
      to: "/admin/pengaturan/profil",
      label: "Profil",
      icon: <FaUsers />,
    },
  ];

  const renderSidebarContent = () => (
    <>
      {/* LOGO + JUDUL */}
      <div className="flex flex-col px-4 py-5 border-b bg-gradient-to-r from-green-400 to-[#B6F500]">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <img
              src={logo}
              alt="Logo Desa"
              className="w-11 h-11 object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight text-base">
              Admin Panel Desa
            </h1>
            <p className="text-sm text-white">Babakan Asem</p>
          </div>
        </div>

        {/* Tampilan Tanggal dan Waktu */}
        <div className="mt-2 text-center">
          <div className="text-xs text-white font-semibold">
            {formatDate(currentTime)}
          </div>
          <div className="text-xs text-white font-medium">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* MENU UTAMA */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          // Styling khusus untuk menu darurat
          if (item.isEmergency) {
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold shadow-md animate-pulse"
                    : "bg-red-500 text-white hover:bg-red-600 font-semibold"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {/* Badge peringatan */}
                <span className="ml-auto bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  Penting!
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 hover:text-green-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* DROPDOWN KELOLA PUBLIKASI */}
        <div>
          <button
            onClick={() => setOpenManagePublik(!openManagePublik)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              managePublikSubmenu.some((item) => location.pathname === item.to)
                ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUserFriends />
              <span>Kelola Publikasi</span>
            </div>
            {openManagePublik ? (
              <FiChevronUp className="text-current" />
            ) : (
              <FiChevronDown className="text-current" />
            )}
          </button>

          {openManagePublik && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-3">
              {managePublikSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-green-50 text-gray-700 hover:text-green-700"
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

        {/* DROPDOWN KELOLA DATA */}
        <div>
          <button
            onClick={() => setOpenManageInformasi(!openManageInformasi)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              manageDataSubmenu.some((item) => location.pathname === item.to)
                ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaClipboardList />
              <span>Kelola Data</span>
            </div>
            {openManageInformasi ? (
              <FiChevronUp className="text-current" />
            ) : (
              <FiChevronDown className="text-current" />
            )}
          </button>

          {openManageInformasi && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-3">
              {manageDataSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-green-50 text-gray-700 hover:text-green-700"
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

        {/* DROPDOWN KELOLA ORGANISASI */}
        <div>
          <button
            onClick={() => setOpenManageOrganisasi(!openManageOrganisasi)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              manageOrganisasiSubmenu.some(
                (item) => location.pathname === item.to
              )
                ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaSitemap />
              <span>Kelola Organisasi</span>
            </div>
            {openManageOrganisasi ? (
              <FiChevronUp className="text-current" />
            ) : (
              <FiChevronDown className="text-current" />
            )}
          </button>

          {openManageOrganisasi && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-3">
              {manageOrganisasiSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-green-50 text-gray-700 hover:text-green-700"
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

        {/* DROPDOWN KELOLA INFOGRAFIS */}
        <div>
          <button
            onClick={() => setOpenInfografis(!openInfografis)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              location.pathname.includes("/admin/kelola-infografis")
                ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaChartPie />
              <span>Kelola Infografis</span>
            </div>
            {openInfografis ? (
              <FiChevronUp className="text-current" />
            ) : (
              <FiChevronDown className="text-current" />
            )}
          </button>

          {openInfografis && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-3">
              {infografisSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-green-50 text-gray-700 hover:text-green-700"
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
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                  : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        <hr className="my-4" />

        {/* KEMBALI KE WEBSITE & KELUAR */}
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm transition-all duration-200"
        >
          <FaArrowLeft /> Kembali ke Website
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-500 text-sm transition-all duration-200"
        >
          <FaSignOutAlt /> Keluar
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* CSS animasi langsung di 1 file */}
      <style>{`
        .sidebar-mobile {
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }
        .sidebar-mobile.open {
          transform: translateX(0);
        }
        .sidebar-mobile.close {
          transform: translateX(-100%);
        }
      `}</style>

      {/* - Sidebar versi desktop */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex-col border-r z-50">
        {renderSidebarContent()}
      </div>

      {/* - Sidebar versi mobile */}
      {isVisible && (
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col border-r z-50 md:hidden sidebar-mobile  ${
            isOpen ? "open" : "close"
          }`}
        >
          {renderSidebarContent()}
        </div>
      )}
    </>
  );
}