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
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess, alertError } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { setProfile } = useAuth();
  const [openInfografis, setOpenInfografis] = useState(false);
  const [openManagePublik, setOpenManagePublik] = useState(false);
  const [openManageInformasi, setOpenManageInformasi] = useState(false);
  const [openManageOrganisasi, setOpenManageOrganisasi] = useState(false);

  // - supaya sidebar mobile gak langsung hilang
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300); // sesuai durasi animasi
  }, [isOpen]);

  const handleLogout = async () => {
    const confirm = await alertConfirm(t("adminSidebar.actions.logoutConfirm"));
    if (!confirm) return;
    const response = await UserApi.logout(i18n.language);
    if (!response.ok) {
      await alertError(t("adminSidebar.actions.logoutError"));
      return;
    }
    setProfile(null);
    await alertSuccess(t("adminSidebar.actions.logoutSuccess"));
    navigate("/login");
  };

  const menu = [
    {
      to: "/admin",
      label: t("adminSidebar.menu.dashboard") || "Dashboard",
      icon: <FaTachometerAlt />,
    },
  ];

  const managePublikSubmenu = [
    {
      to: "/admin/manage-berita",
      label: t("adminSidebar.menu.manageNews") || "Kelola Berita",
      icon: <FaNewspaper />,
    },
    {
      to: "/admin/manage-agenda",
      label: t("adminSidebar.menu.manageAgenda") || "Kelola Agenda",
      icon: <FaCalendarAlt />,
    },
    {
      to: "/admin/manage-galery",
      label: t("adminSidebar.menu.villageGallery") || "Galeri Desa",
      icon: <FaImage />,
    },
    {
      to: "/admin/manage-anggota",
      label:
        t("adminSidebar.menu.organizationStructure") || "Struktur Organisasi",
      icon: <FaSitemap />,
    },
    {
      to: "/admin/manage-prestasi",
      label: t("adminSidebar.menu.ManagePrestasi") || "Kelola Prestasi",
      icon: <FaStar />,
    },
    {
      to: "/admin/manage-program",
      label: t("adminSidebar.menu.ManageProgram") || "Kelola Program",
      icon: <FaTasks />,
    },
    {
      to: "/admin/manage-apb",
      label: t("adminSidebar.menu.ManageApb") || "Kelola APB",
      icon: <FaMoneyCheckAlt />, // ikon keuangan
    },
  ];

  const manageDataSubmenu = [
    {
      to: "/admin/manage-user",
      label: t("adminSidebar.menu.manageUsers") || "Kelola Pengguna",
      icon: <FaUsers />,
    },
    {
      to: "/admin/manage-pesan",
      label: t("adminSidebar.menu.manageMessages") || "Kelola Pesan",
      icon: <FaEnvelope />,
    },
    {
      to: "/admin/manage-administrasi",
      label: t("adminSidebar.menu.administration") || "Administrasi",
      icon: <FaClipboardList />,
    },
    // {
    //   to: "/admin/manage-region",
    //   label:
    //     i18n.language === "en"
    //       ? "Manage Region (Area)"
    //       : "Kelola Wilayah (Region)",
    //   icon: <FaSitemap />,
    // },
    // {
    //   to: "/admin/manage-poi",
    //   label:
    //     i18n.language === "en"
    //       ? "Manage POI (Point of Interest)"
    //       : "Kelola POI (Point of Interest)",
    //   icon: <FaMapMarkerAlt />,
    // },
  ];

  const manageOrganisasiSubmenu = [
    {
      to: "/admin/manage-pkk",
      label: t("adminSidebar.menu.pkkPrograms") || "Program PKK",
      icon: <FaUsersCog />,
    },
    {
      to: "/admin/manage-bumdes",
      label: t("adminSidebar.menu.bumdesProducts") || "Produk BUMDes",
      icon: <FaStore />,
    },
  ];

  const infografisSubmenu = [
    {
      to: "/admin/kelola-infografis/penduduk",
      label:
        t("adminSidebar.infographics.submenu.population") || "Data Penduduk",
      icon: <FaUserFriends />,
    },
    {
      to: "/admin/kelola-infografis/idm",
      label:
        t("adminSidebar.infographics.submenu.villageIndex") ||
        "Indeks Desa Membangun",
      icon: <FaGlobeAsia />,
    },
    {
      to: "/admin/kelola-infografis/bansos",
      label:
        t("adminSidebar.infographics.submenu.socialAssistance") ||
        "Bantuan Sosial",
      icon: <FaHandshake />,
    },
    {
      to: "/admin/kelola-infografis/sdgs",
      label: t("adminSidebar.infographics.submenu.sdgsVillage") || "SDGs Desa",
      icon: <FaPeopleCarry />,
    },
  ];

  const pengaturan = [
    {
      to: "/admin/pengaturan/profil",
      label: t("adminSidebar.settings.profile") || "Profil",
      icon: <FaUsers />,
    },
  ];

  const renderSidebarContent = () => (
    <>
      {/* LOGO + JUDUL */}
      <div className="flex items-center gap-3 px-4 py-5 border-b bg-gradient-to-r from-green-400 to-[#B6F500]">
        <div className="bg-white p-1 rounded-lg shadow-sm">
          <img src={logo} alt="Logo Desa" className="w-9 h-9 object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight text-base">
            {t("adminSidebar.title") || "Admin Panel Desa"}
          </h1>
          <p className="text-xs text-green-100">
            {t("adminSidebar.subtitle") || "Babakan Asem"}
          </p>
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
              <span>
                {t(
                  "adminSidebar.dropdowns.managePublications",
                  "Kelola Publikasi"
                )}
              </span>
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
              <span>
                {t("adminSidebar.dropdowns.manageData", "Kelola Data")}
              </span>
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
              <span>
                {t(
                  "adminSidebar.dropdowns.manageOrganizations",
                  "Kelola Organisasi"
                )}
              </span>
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
              <span>
                {t("adminSidebar.infographics.title") || "Kelola Infografis"}
              </span>
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
          {t("adminSidebar.settings.title") || "Pengaturan"}
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
          <FaArrowLeft />{" "}
          {t("adminSidebar.actions.backToWebsite") || "Kembali ke Website"}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-500 text-sm transition-all duration-200"
        >
          <FaSignOutAlt /> {t("adminSidebar.actions.logout") || "Keluar"}
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
          className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col border-r z-50 md:hidden sidebar-mobile ${
            isOpen ? "open" : "close"
          }`}
        >
          {renderSidebarContent()}
        </div>
      )}
    </>
  );
}
