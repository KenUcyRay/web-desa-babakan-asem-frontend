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
  FaStar, // ✅ Ganti ke FaStar yang pasti ada
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { logout, setAdminStatus } = useAuth();
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
    setAdminStatus(false);
    logout();
    await alertSuccess(t("adminSidebar.actions.logoutSuccess"));
    navigate("/login");
  };

  const menu = [
    {
      to: "/admin",
      label: t("adminSidebar.menu.dashboard"),
      icon: <FaTachometerAlt />,
    },
  ];

  const managePublikSubmenu = [
  {
    to: "/admin/manage-berita",
    label: t("adminSidebar.menu.manageNews"),
    icon: <FaNewspaper />,
  },
  {
    to: "/admin/manage-agenda",
    label: t("adminSidebar.menu.manageAgenda"),
    icon: <FaCalendarAlt />,
  },
  {
    to: "/admin/manage-galery",
    label: t("adminSidebar.menu.villageGallery"),
    icon: <FaImage />,
  },
  {
    to: "/admin/manage-anggota",
    label: t("adminSidebar.menu.organizationStructure"),
    icon: <FaSitemap />,
  },
  {
    to: "/admin/manage-prestasi",
    label: t("adminSidebar.menu.ManagePrestasi"),
    icon: <FaStar />, // ✅ Icon bintang yang pasti ada
  },
];

  

  const manageDataSubmenu = [
    {
      to: "/admin/manage-user",
      label: t("adminSidebar.menu.manageUsers"),
      icon: <FaUsers />,
    },
    {
      to: "/admin/manage-pesan",
      label: t("adminSidebar.menu.manageMessages"),
      icon: <FaEnvelope />,
    },
    {
      to: "/admin/manage-administrasi",
      label: t("adminSidebar.menu.administration"),
      icon: <FaClipboardList />,
    },
  ];

  const manageOrganisasiSubmenu = [
    {
      to: "/admin/manage-pkk",
      label: t("adminSidebar.menu.pkkPrograms"),
      icon: <FaUsersCog />,
    },
    {
      to: "/admin/manage-bumdes",
      label: t("adminSidebar.menu.bumdesProducts"),
      icon: <FaStore />,
    },
  ];

  const infografisSubmenu = [
    {
      to: "/admin/kelola-infografis/penduduk",
      label: t("adminSidebar.infographics.submenu.population"),
      icon: <FaUserFriends />,
    },
    {
      to: "/admin/kelola-infografis/idm",
      label: t("adminSidebar.infographics.submenu.villageIndex"),
      icon: <FaGlobeAsia />,
    },
    {
      to: "/admin/kelola-infografis/bansos",
      label: t("adminSidebar.infographics.submenu.socialAssistance"),
      icon: <FaHandshake />,
    },
    {
      to: "/admin/kelola-infografis/sdgs",
      label: t("adminSidebar.infographics.submenu.sdgsVillage"),
      icon: <FaPeopleCarry />,
    },
  ];

  const pengaturan = [
    {
      to: "/admin/pengaturan/profil",
      label: t("adminSidebar.settings.profile"),
      icon: <FaUsers />,
    },
  ];

  const renderSidebarContent = () => (
    <>
      {/* LOGO + JUDUL */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <img src={logo} alt="Logo Desa" className="w-11 h-11 object-contain" />
        <div>
          <h1 className="font-bold text-green-700 leading-tight text-base">
            {t("adminSidebar.title")}
          </h1>
          <p className="text-xs text-gray-500">{t("adminSidebar.subtitle")}</p>
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
                  ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                  : "text-gray-700 hover:bg-green-50"
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
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition ${
              managePublikSubmenu.some((item) => location.pathname === item.to)
                ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUserFriends />
              <span>Kelola Publikasi</span>
            </div>
            {openManagePublik ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {openManagePublik && (
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {managePublikSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
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

        {/* DROPDOWN KELOLA DATA */}
        <div>
          <button
            onClick={() => setOpenManageInformasi(!openManageInformasi)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition ${
              manageDataSubmenu.some((item) => location.pathname === item.to)
                ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaClipboardList />
              <span>Kelola Data</span>
            </div>
            {openManageInformasi ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {openManageInformasi && (
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {manageDataSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
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

        {/* DROPDOWN KELOLA ORGANISASI */}
        <div>
          <button
            onClick={() => setOpenManageOrganisasi(!openManageOrganisasi)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition ${
              manageOrganisasiSubmenu.some(
                (item) => location.pathname === item.to
              )
                ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-500"
                : "hover:bg-green-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaSitemap />
              <span>Kelola Organisasi</span>
            </div>
            {openManageOrganisasi ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {openManageOrganisasi && (
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {manageOrganisasiSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
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

        {/* DROPDOWN KELOLA INFOGRAFIS */}
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
              <span>{t("adminSidebar.infographics.title")}</span>
            </div>
            {openInfografis ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {openInfografis && (
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {infografisSubmenu.map((sub) => {
                const isActive = location.pathname === sub.to;
                return (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
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
          {t("adminSidebar.settings.title")}
        </p>
        {pengaturan.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
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

        {/* KEMBALI KE WEBSITE & KELUAR */}
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
        >
          <FaArrowLeft /> {t("adminSidebar.actions.backToWebsite")}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-500 text-sm"
        >
          <FaSignOutAlt /> {t("adminSidebar.actions.logout")}
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
