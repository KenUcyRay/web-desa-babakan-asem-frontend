import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import kumpul from "../../assets/kumpul.jpg";
import { useTranslation } from "react-i18next";

export default function ProfilDesa() {
  const { t } = useTranslation();
  const [activeMilestone, setActiveMilestone] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleNextMilestone = () => {
    setActiveMilestone((prev) => 
      prev < t("profileVillage.achievements", { returnObjects: true }).length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevMilestone = () => {
    setActiveMilestone((prev) => 
      prev > 0 ? prev - 1 : t("profileVillage.achievements", { returnObjects: true }).length - 1
    );
  };

  return (
    <div className="font-poppins bg-gray-50">
      {/* - HERO SECTION */}
      <section className="relative bg-[#FFFDF6]" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 mb-4 shadow">
              {t("profileVillage.tagline")}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: t("profileVillage.title") }}
            />
            <p className="text-gray-700 text-lg leading-relaxed">
              {t("profileVillage.description")}
            </p>
          </div>
          <div className="relative flex justify-center" data-aos="zoom-in">
            <div className="rounded-2xl overflow-hidden shadow-xl w-full md:w-4/5">
              <img
                src={kumpul}
                alt="Warga Desa Berkumpul"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* - SEJARAH */}
      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t("profileVillage.historyTitle")}
          </h2>
          <p
            className="text-gray-700 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{
              __html: t("profileVillage.historyText"),
            }}
          />
        </div>
      </section>

      {/* - VISI & MISI */}
      <section
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8"
        data-aos="fade-up"
      >
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-right"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            {t("profileVillage.visionTitle")}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t("profileVillage.visionText")}
          </p>
        </div>
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-left"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            {t("profileVillage.missionTitle")}
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {t("profileVillage.missionList", { returnObjects: true }).map(
              (item, i) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* - Prestasi */}
      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
            {t("profileVillage.achievementsTitle")}
          </h2>
          <div className="space-y-10 mb-16">
            {t("profileVillage.achievements", { returnObjects: true }).map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 rounded-xl shadow-md p-6"
                data-aos="fade-up"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full md:w-1/3 h-56 object-cover rounded-lg shadow"
                />
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Milestone Horizontal - Updated */}
          <div className="relative w-full py-10">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-14">
              Jejak Penghargaan Desa
            </h3>
            
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>
              
              {/* Milestone Items */}
              <div className="relative flex justify-between z-10">
                {t("profileVillage.achievements", { returnObjects: true }).map((item, index) => (
                  <div 
                    key={index} 
                    className="relative flex flex-col items-center"
                  >
                    {/* Milestone Dot & Connector */}
                    <div className="absolute top-1/2 w-full h-1 transform -translate-y-1/2 -z-10">
                      <div className="w-full h-full bg-gray-300"></div>
                    </div>
                    
                    {/* Milestone Dot */}
                    <div 
                      className="relative w-10 h-10 rounded-full bg-white border-4 border-green-600 flex items-center justify-center mb-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 group"
                      onClick={() => window.location.href = `/prestasi/${item.id}`} // Ganti dengan link yang sesuai
                    >
                      <div className="w-4 h-4 rounded-full bg-green-600"></div>
                      
                      {/* Milestone Popup */}
                      <div className="absolute bottom-full mb-3 w-64 p-4 rounded-lg shadow-lg bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-x-1/2 left-1/2">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-4 bg-white rotate-45"></div>
                        <div className="text-xs font-semibold text-green-600 mb-1">
                          {item.year}
                        </div>
                        <div className="text-sm font-medium text-gray-800 mb-2">
                          {item.title}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Milestone Label */}
                    <div className="text-xs font-medium text-gray-700 mt-10 text-center px-2">
                      {item.year}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1 text-center px-2">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* - KONTAK & SOSMED */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
            {t("profileVillage.contactTitle")}
          </h2>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <div
              className="p-6 rounded-xl shadow-lg bg-white flex items-start gap-4 hover:shadow-xl transition"
              data-aos="fade-right"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  {t("profileVillage.locationTitle")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t("profileVillage.locationDetail")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" data-aos="fade-up">
              <a
                href="tel:085330192025"
                className="p-5 rounded-xl shadow-md bg-white flex flex-col items-start gap-2 hover:shadow-xl transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {t("profileVillage.phoneTitle")}
                  </h4>
                  <p className="text-xs text-gray-700">0853-3019-2025</p>
                </div>
              </a>
              <a
                href="https://wa.me/6285330192025"
                className="p-5 rounded-xl shadow-md bg-white flex flex-col items-start gap-2 hover:shadow-xl transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {t("profileVillage.whatsappTitle")}
                  </h4>
                  <p className="text-xs text-gray-700">+62 853‑3019‑2025</p>
                </div>
              </a>
            </div>
            <a
              href="mailto:babakanasem@gmail.com"
              className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
              data-aos="fade-left"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  {t("profileVillage.emailTitle")}
                </h4>
                <p className="text-sm text-gray-700">babakanasem@gmail.com</p>
              </div>
            </a>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
              data-aos="fade-up"
            >
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <FaFacebook className="text-blue-600 text-3xl" />
                <span className="font-semibold text-gray-800">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <FaInstagram className="text-pink-500 text-3xl" />
                <span className="font-semibold text-gray-800">Instagram</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <FaTiktok className="text-black text-3xl" />
                <span className="font-semibold text-gray-800">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* - MAP */}
      <section
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center"
        data-aos="fade-up"
      >
        <div
          className="bg-gradient-to-br from-[#9BEC00]/10 to-[#D2FF72]/20 shadow-lg rounded-2xl p-10"
          data-aos="fade-right"
        >
          <h3 className="text-3xl font-bold text-green-700 mb-6">
            {t("profileVillage.mapTitle")}
          </h3>
          <ul className="space-y-4 text-gray-800 text-lg">
            <li
              dangerouslySetInnerHTML={{ __html: t("profileVillage.mapNorth") }}
            />
            <li
              dangerouslySetInnerHTML={{ __html: t("profileVillage.mapSouth") }}
            />
            <li
              dangerouslySetInnerHTML={{ __html: t("profileVillage.mapWest") }}
            />
            <li
              dangerouslySetInnerHTML={{ __html: t("profileVillage.mapEast") }}
            />
          </ul>
        </div>
        <div
          className="rounded-2xl overflow-hidden shadow-xl border border-green-100"
          data-aos="zoom-in"
        >
          <iframe
            title="Lokasi Desa Babakan Asem"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50846.83215472047!2d108.04488070198364!3d-6.7568080545342095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2aaf583cd373%3A0x997e0a8c838d37df!2sBabakan%20Asem%2C%20Kec.%20Conggeang%2C%20Kabupaten%20Sumedang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1753327873604!5m2!1sid!2sid"
            width="100%"
            height="380"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}