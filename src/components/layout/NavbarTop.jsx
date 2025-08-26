import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function NavbarTop() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("ID");
  const [hideTopbar, setHideTopbar] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const changeLang = (lang) => {
    setCurrentLang(lang);
    changeLanguage(lang.toLowerCase());
  };

  useEffect(() => {
    setCurrentLang(i18n.language.toUpperCase());
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setHideTopbar(true);
      } else {
        setHideTopbar(false);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <div
      className={`w-full bg-white shadow transition-transform duration-300 z-[40] ${
        hideTopbar ? "-translate-y-full" : "translate-y-0"
      } fixed top-0 left-0`}
    >
      <div className="w-full px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 flex flex-col md:flex-row md:justify-between md:items-center sm:px-6 md:px-16 gap-3">
        {/* ✅ ROW 1: Menu */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide justify-center px-4 sm:justify-start sm:px-0">
          {[
            ["PKK", "/pkk"],
            ["BUMDes", "/bumdes"],
            ["Karang Taruna", "/karang-taruna"],
            ["BPD", "/bpd"],
            // ["Galeri", "/galeri"],
            // ["Koperasi Merah Putih", "/koperasi-merah-putih"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="whitespace-nowrap hover:text-[#B6F500] transition font-semibold"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ✅ ROW 2 Bahasa */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <FaGlobe className="text-gray-600" size={14} />
            <div
              className="relative flex items-center cursor-pointer"
              onClick={() => changeLang(currentLang === "ID" ? "EN" : "ID")}
            >
              <div className="flex bg-gray-100 rounded-md p-1">
                <span
                  className={`px-3 py-1 rounded-md transition-all duration-200 ${
                    currentLang === "ID"
                      ? "bg-white text-gray-900 font-semibold shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  ID
                </span>
                <span
                  className={`px-3 py-1 rounded-md transition-all duration-200 ${
                    currentLang === "EN"
                      ? "bg-white text-gray-900 font-semibold shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
