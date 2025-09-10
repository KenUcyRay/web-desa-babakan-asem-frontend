import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaFacebookF,
  FaYoutube,
  FaGoogle,
  FaTwitter,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaGooglePlay,
} from "react-icons/fa";
import foto1 from "../../assets/sponsor1.png";
import foto2 from "../../assets/sponsor2.png";
import foto3 from "../../assets/sponsor3.png";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-[#1a1a1a] via-[#2e2b2b] to-[#1f1f1f] text-white w-full font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#B6F500] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B6F500] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 w-full px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        {/* Village Info Section */}
        <div className="md:col-span-1">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="group flex-shrink-0 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#B6F500] rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <img
                    src={logo}
                    alt="Logo Desa"
                    className="relative w-150 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-2xl"
                  />
                </div>
              </Link>
            </div>
            
            <div className="md:text-left text-center mt-4 md:mt-0">
              <h3 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                {t("footer.village_name")}
              </h3>
              <p className="text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
                {t("footer.address")}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="md:text-left text-center">
          <h4 className="text-lg font-bold mb-6 text-[#B6F500] tracking-wide">
            {t("footer.contact_us")}
          </h4>
          <div className="space-y-4">
            <a href="tel:" className="flex justify-center md:justify-start items-center gap-4 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group">
              <div className="bg-[#B6F500]/20 p-2 rounded-lg group-hover:bg-[#B6F500]/30 transition-colors">
                <FaPhone className="text-[#B6F500] text-lg" />
              </div>
              <span>{t("footer.phone")}</span>
            </a>
            <a href="mailto:" className="flex justify-center md:justify-start items-center gap-4 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group">
              <div className="bg-[#B6F500]/20 p-2 rounded-lg group-hover:bg-[#B6F500]/30 transition-colors">
                <FaEnvelope className="text-[#B6F500] text-lg" />
              </div>
              <span>{t("footer.email")}</span>
            </a>
          </div>
        </div>

        {/* Services Section */}
        <div className="md:text-left text-center">
          <h4 className="text-lg font-bold mb-6 text-[#B6F500] tracking-wide">
            {t("footer.services")}
          </h4>
          <div className="space-y-3">
            <p className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
              {t("footer.service_1")}
            </p>
            <p className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
              {t("footer.service_2")}
            </p>
          </div>
        </div>

        {/* Explore & Social Section */}
        <div className="md:text-left text-center">
          <h4 className="text-lg font-bold mb-6 text-[#B6F500] tracking-wide">
            {t("footer.explore")}
          </h4>
          <ul className="space-y-3 mb-8">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                >
                  {t(`footer.explore_${i}`)}
                </a>
              </li>
            ))}
          </ul>

          {/* Google Play Store Card */}
          <div className="mb-8">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#B6F500] to-[#9AE500] text-black px-5 py-4 rounded-xl hover:from-[#A5E500] hover:to-[#8BD400] hover:scale-105 hover:shadow-2xl hover:shadow-[#B6F500]/25 transition-all duration-300 font-medium"
            >
              <FaGooglePlay className="text-xl" />
              <div className="text-left">
                <p className="text-xs font-medium leading-tight opacity-80">
                  {t("footer.available_on")}
                </p>
                <p className="text-sm font-bold leading-tight">
                  Google Play
                </p>
              </div>
            </a>
          </div>
          
          {/* Social Media Icons */}
          <div>
            <p className="text-sm text-gray-400 mb-4">{t("footer.follow_us")}</p>
            <div className="flex gap-3 justify-center md:justify-start">
              {[FaFacebookF, FaYoutube, FaGoogle, FaTwitter, FaTiktok].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 hover:bg-[#B6F500] text-gray-300 hover:text-black p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <Icon className="text-lg" />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Section */}
      <div className="relative z-10 border-t border-gray-600/50 bg-black/10 backdrop-blur-sm">
        <div className="px-6 py-8">
          <h4 className="text-lg font-bold mb-6 text-[#B6F500] tracking-wide text-center">
            {t("footer.supported_by")}
          </h4>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <img
              src={foto1}
              alt="Sponsor 1"
              className="h-12 opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
            />
            <img
              src={foto2}
              alt="Sponsor 2"
              className="h-12 opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
            />
            <img
              src={foto3}
              alt="Sponsor 3"
              className="h-12 opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="relative z-10 border-t border-gray-600/50 bg-black/20 backdrop-blur-sm">
        <div className="px-6 py-6 flex justify-center">
          <p className="text-sm text-gray-400 text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
