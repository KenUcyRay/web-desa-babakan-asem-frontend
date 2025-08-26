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
    <footer className="bg-[#2e2b2b] text-white w-full font-['Poppins',sans-serif]">
      <div className="w-full px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
          <Link to="/" className="group flex-shrink-0">
            <img
              src={logo}
              alt="Logo Desa"
              className="w-28 opacity-90 group-hover:opacity-100 transition duration-300"
            />
          </Link>
          <div className="md:text-left text-center">
            <p className="text-[17px] font-semibold tracking-wide">
              {t("footer.village_name")}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-400 hover:text-white transition duration-200">
              {t("footer.address")}
            </p>
          </div>
        </div>

        <div className="md:text-left text-center">
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            {t("footer.contact_us")}
          </p>
          <p className="flex justify-center md:justify-start items-center gap-3 text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            <FaPhone className="text-[#B6F500] text-[18px]" />{" "}
            {t("footer.phone")}
          </p>
          <p className="flex justify-center md:justify-start items-center gap-3 mt-3 text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            <FaEnvelope className="text-[#B6F500] text-[18px]" />{" "}
            {t("footer.email")}
          </p>
        </div>

        <div className="md:text-left text-center">
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            {t("footer.services")}
          </p>
          <p className="text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            {t("footer.service_1")}
          </p>
          <p className="text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all mt-2">
            {t("footer.service_2")}
          </p>
        </div>

        <div className="md:text-left text-center">
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            {t("footer.explore")}
          </p>
          <ul className="space-y-2 text-[15px]">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  {t(`footer.explore_${i}`)}
                </a>
              </li>
            ))}
          </ul>

          {/* Google Play Store Card */}
          <div className="mt-6">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#B6F500] to-[#9AE500] text-black px-4 py-3 rounded-lg hover:from-[#A5E500] hover:to-[#8BD400] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaGooglePlay className="text-[20px]" />
              <div className="text-left">
                <p className="text-[11px] font-medium leading-tight">
                  Tersedia di
                </p>
                <p className="text-[14px] font-bold leading-tight">
                  Google Play
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-8 flex flex-col items-center">
        <p className="mb-5 text-gray-300 font-medium text-sm uppercase tracking-wide">
          {t("footer.supported_by")}
        </p>
        <div className="flex gap-16 flex-wrap justify-center">
          {[foto1, foto2, foto3].map((foto, idx) => (
            <a
              key={idx}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <img
                src={foto}
                alt={`Sponsor ${idx + 1}`}
                className="h-20 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col items-center">
        <div className="flex gap-7 mb-5 flex-wrap justify-center">
          {[FaFacebookF, FaYoutube, FaGoogle, FaTwitter, FaTiktok].map(
            (Icon, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[26px] opacity-75 hover:opacity-100 transition-transform duration-300 hover:scale-110"
              >
                <Icon />
              </a>
            )
          )}
        </div>
        <p className="text-[13px] opacity-80 text-center tracking-wide">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
