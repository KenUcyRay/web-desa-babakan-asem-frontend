import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function TopNavbar() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("ID");
  const [showAlt, setShowAlt] = useState(false);
  const [hideTopbar, setHideTopbar] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const toggleLangMenu = () => setShowAlt((prev) => !prev);
  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const changeLang = (lang) => {
    setCurrentLang(lang);
    changeLanguage(lang.toLowerCase());
    setShowAlt(false);
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

  const altLang = currentLang === "ID" ? "EN" : "ID";

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
            ["BUMDES", "/bumdes"],
            ["Karang Taruna", "/karang-taruna"],
            ["Galeri", "/galeri"],
            ["DPD", "/dpd"],
            ["BPD", "/bpd"],
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

        {/* ✅ ROW 2: Sosmed + Bahasa */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
          {/* Icons */}
          <div className="flex gap-3">
            {[
              [
                "https://www.facebook.com/KpuSumedangKab/?locale=id_ID",
                <FaFacebookF />,
              ],
              ["https://www.instagram.com/inimahsumedang/", <FaInstagram />],
              ["https://www.tiktok.com/@bpskabsumedang", <FaTiktok />],
              [
                "https://api.whatsapp.com/send?phone=6281122202220&text=Simpati",
                <FaWhatsapp />,
              ],
              ["#", <MdEmail />],
            ].map(([href, icon], idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-current transition text-base"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Language Toggle */}
          <div
            className="flex items-center gap-1 text-gray-600 cursor-pointer select-none hover:text-[#B6F500]"
            onClick={toggleLangMenu}
          >
            <FaGlobe size={14} />
            {!showAlt ? (
              <span className="text-sm">{currentLang}</span>
            ) : (
              <>
                <span className="font-semibold text-[#B6F500]">
                  {currentLang}
                </span>
                <span>|</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLang(altLang);
                  }}
                  className="hover:text-[#B6F500]"
                >
                  {altLang}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
