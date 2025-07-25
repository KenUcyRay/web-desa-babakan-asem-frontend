import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUsers,
  FaChartLine,
  FaHandsHelping,
  FaSeedling,
} from "react-icons/fa";

export default function InfografisLayout() {
  const { t } = useTranslation();

  const menu = [
    {
      to: "penduduk",
      label: t("infografis.layout.menu.resident"),
      icon: <FaUsers />,
    },
    {
      to: "idm",
      label: t("infografis.layout.menu.idm"),
      icon: <FaChartLine />,
    },
    {
      to: "bansos",
      label: t("infografis.layout.menu.bansos"),
      icon: <FaHandsHelping />,
    },
    {
      to: "sdgs",
      label: t("infografis.layout.menu.sdgs"),
      icon: <FaSeedling />,
    },
  ];

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      {/* 🔹 HEADER INFOGRAFIS */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6">
          {/* Judul di kiri */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("infografis.layout.title")}
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {t("infografis.layout.subtitle")}
            </p>
          </div>

          {/* ✅ Navbar icon final: gap & size dinamis */}
          <div className="mt-4 md:mt-0 overflow-x-auto w-full md:w-auto">
            <div className="flex gap-5 md:gap-8 min-w-max px-2">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 px-3 md:px-5 py-2 rounded-lg transition ${
                      isActive
                        ? "text-[#B6F500] bg-gray-100 shadow-md"
                        : "text-gray-600 hover:text-[#B6F500]"
                    }`
                  }
                >
                  <div className="text-xl md:text-2xl">{item.icon}</div>
                  <span className="text-xs md:text-sm font-medium">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 HALAMAN ANAK */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
