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
import { useTranslation } from "react-i18next"; // ✅ IMPORT YANG DIBUTUHKAN

export default function TopNavbar() {
  const { i18n } = useTranslation(); // ✅ AMBIL DARI i18n
  const [currentLang, setCurrentLang] = useState("ID");
  const [showAlt, setShowAlt] = useState(false);
  const [hideTopbar, setHideTopbar] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const toggleLangMenu = () => setShowAlt((prev) => !prev);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // id atau en
  };

  const changeLang = (lang) => {
    setCurrentLang(lang);
    changeLanguage(lang.toLowerCase());
    setShowAlt(false);
  };

  // ✅ Sinkronisasi bahasa awal dari i18n
  useEffect(() => {
    setCurrentLang(i18n.language.toUpperCase()); // Misal: id -> ID
  }, [i18n.language]);

  // ✅ Auto hide topbar saat scroll ke bawah
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
      <div className="w-full flex flex-wrap items-center justify-between px-6 xl:px-16 py-3 text-xs sm:text-sm font-medium text-gray-700 relative">
        {/* ✅ Menu kiri */}
        <div className="flex gap-6 justify-start w-full sm:w-auto overflow-x-auto scrollbar-hide">
          <Link
            to="/pkk"
            className="whitespace-nowrap hover:text-[#B6F500] transition"
          >
            PKK
          </Link>
          <Link
            to="/bumdes"
            className="whitespace-nowrap hover:text-[#B6F500] transition"
          >
            BUMDES
          </Link>
          <Link
            to="/karang-taruna"
            className="whitespace-nowrap hover:text-[#B6F500] transition"
          >
            Karang Taruna
          </Link>
          <Link
            to="/galeri"
            className="whitespace-nowrap hover:text-[#B6F500] transition"
          >
            Galeri
          </Link>
          <Link
            to="/dpd"
            className="whitespace-nowrap hover:text-[#B6F500] transition font-semibold"
          >
            DPD
          </Link>
          <Link
            to="/bpd"
            className="whitespace-nowrap hover:text-[#B6F500] transition font-semibold"
          >
            BPD
          </Link>
        </div>

        {/* ✅ Sosmed + Bahasa */}
        <div className="relative flex items-center gap-5 justify-center w-full sm:w-auto mt-2 sm:mt-0">
          <a
            href="https://www.facebook.com/KpuSumedangKab/?locale=id_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/inimahsumedang/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@bpskabsumedang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition"
          >
            <FaTiktok />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=6281122202220&text=Simpati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-green-500 transition"
          >
            <FaWhatsapp />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-red-500 transition"
          >
            <MdEmail />
          </a>

          {/* ✅ Bahasa Toggle */}
          <div
            className="flex items-center gap-1 text-gray-600 ml-4 cursor-pointer select-none hover:text-[#B6F500]"
            onClick={toggleLangMenu}
          >
            <FaGlobe size={14} />
            {!showAlt ? (
              <span>{currentLang}</span>
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
