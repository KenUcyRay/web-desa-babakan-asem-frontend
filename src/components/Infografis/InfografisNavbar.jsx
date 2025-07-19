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
    <div className="overflow-x-auto w-full">
      <div className="flex gap-5 md:gap-8 justify-start px-4 md:px-6 min-w-max font-poppins">
        {menu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs md:text-sm transition ${
                isActive
                  ? "text-[#B6F500]"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <div className="text-xl md:text-2xl">{item.icon}</div>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
