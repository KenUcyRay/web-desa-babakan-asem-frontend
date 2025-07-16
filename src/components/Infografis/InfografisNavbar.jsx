import { NavLink } from "react-router-dom";
import { FaUsers, FaHandsHelping, FaChartLine, FaLeaf } from "react-icons/fa";

export default function InfografisNavbar() {
  const menu = [
    { to: "penduduk", label: "Penduduk", icon: <FaUsers /> },
    { to: "bansos", label: "Bansos", icon: <FaHandsHelping /> },
    { to: "idm", label: "IDM", icon: <FaChartLine /> },
    { to: "sdgs", label: "SDGs", icon: <FaLeaf /> },
  ];

  return (
    <div className="flex items-center justify-between border-b p-4 font-poppins">
      {/* Judul Kiri */}
      <h1 className="text-xl font-bold text-gray-800">
        INFOGRAFIS DESA BABAKAN ASEM
      </h1>

      {/* Menu Kanan */}
      <div className="flex gap-6">
        {menu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-sm transition ${
                isActive ? "text-[#B6F500]" : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <div className="text-2xl">{item.icon}</div>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
