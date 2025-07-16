import { Outlet, NavLink } from "react-router-dom";
import { FaUsers, FaChartLine, FaHandsHelping, FaSeedling } from "react-icons/fa";

export default function InfografisLayout() {
  const menu = [
    { to: "penduduk", label: "Penduduk", icon: <FaUsers size={28} /> }, // ✅ icon dibesarin
    { to: "idm", label: "IDM", icon: <FaChartLine size={28} /> },
    { to: "bansos", label: "Bansos", icon: <FaHandsHelping size={28} /> },
    { to: "sdgs", label: "SDGs", icon: <FaSeedling size={28} /> },
  ];

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      
      {/* 🔹 HEADER INFOGRAFIS */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-6">
          {/* Judul di kiri */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              INFOGRAFIS DESA BABAKAN ASEM
            </h1>
            <p className="text-gray-600 mt-1">
              Data lengkap desa yang mudah dipahami.
            </p>
          </div>

          {/* ✅ Navbar icon di kanan */}
          <div className="flex gap-6 mt-4 md:mt-0">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "text-[#B6F500] bg-white shadow-md" // ✅ Warna + background biar keliatan aktif
                      : "text-gray-700 hover:text-[#B6F500]"
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 HALAMAN ANAK */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
