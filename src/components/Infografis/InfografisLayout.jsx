import { NavLink, Outlet } from "react-router-dom";
import { FaUsers, FaChartBar, FaHandsHelping, FaGlobe } from "react-icons/fa";

export default function InfografisLayout() {
  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      {/* Sub Navbar */}
      <div className="sticky top-[80px] bg-white shadow-md z-30">
        <div className="max-w-6xl mx-auto flex justify-around py-3">
          <NavLink
            to="penduduk"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 transition ${
                isActive ? "text-[#B6F500]" : "text-gray-800"
              }`
            }
          >
            <FaUsers /> Penduduk
          </NavLink>
          <NavLink
            to="idm"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 transition ${
                isActive ? "text-[#B6F500]" : "text-gray-800"
              }`
            }
          >
            <FaChartBar /> IDM
          </NavLink>
          <NavLink
            to="bansos"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 transition ${
                isActive ? "text-[#B6F500]" : "text-gray-800"
              }`
            }
          >
            <FaHandsHelping /> Bansos
          </NavLink>
          <NavLink
            to="sdgs"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 transition ${
                isActive ? "text-[#B6F500]" : "text-gray-800"
              }`
            }
          >
            <FaGlobe /> SDGs
          </NavLink>
        </div>
      </div>

      {/* Tempat render child */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
