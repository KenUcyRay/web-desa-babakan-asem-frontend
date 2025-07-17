import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="w-full fixed top-0 left-0 bg-white dark:bg-black shadow z-50">
      {/* ✅ Biar full width tapi konten tetap rapi */}
      <div className="w-full flex flex-wrap items-center justify-between px-6 xl:px-16 py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
        {/* Menu kiri */}
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start w-full sm:w-auto">
          <Link to="/pkk" className="hover:text-[#B6F500] transition">
            PKK
          </Link>
          <Link to="/bumdes" className="hover:text-[#B6F500] transition">
            BUMDES
          </Link>
          <Link to="/karang-taruna" className="hover:text-[#B6F500] transition">
            Karang Taruna
          </Link>
          <Link to="/galeri" className="hover:text-[#B6F500] transition">
            Galeri
          </Link>
        </div>

        {/* Sosmed + Darkmode */}
        <div className="flex items-center gap-5 justify-center w-full sm:w-auto mt-2 sm:mt-0">
          <a href="#" className="hover:text-[#B6F500] transition">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-[#B6F500] transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-[#B6F500] transition">
            <FaYoutube />
          </a>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </div>
  );
}
