import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaMoon, FaSun } from "react-icons/fa";

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode class ke <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="w-full sticky top-[32px] bg-white shadow z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-200">
        
        {/* ✅ Menu kiri pakai Link supaya SPA */}
        <div className="flex gap-4">
          <Link to="/pkk" className="hover:text-[#B6F500] transition">PKK</Link>
          <Link to="/bumdes" className="hover:text-[#B6F500] transition">BUMDES</Link>
          <Link to="/karang-taruna" className="hover:text-[#B6F500] transition">Karang Taruna</Link>
          <Link to="/galeri" className="hover:text-[#B6F500] transition">Galeri</Link>
        </div>

        {/* Bagian kanan: sosmed + toggle dark mode */}
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/PrabowoSubianto/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="hover:text-[#B6F500] transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-[#B6F500] transition"><FaInstagram /></a>
          <a href="#" className="hover:text-[#B6F500] transition"><FaYoutube /></a>

          {/* Toggle dark mode */}
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
