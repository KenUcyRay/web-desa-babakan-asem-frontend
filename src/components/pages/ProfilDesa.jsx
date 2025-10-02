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
import { Link } from "react-router-dom"; // Pastikan Link diimpor
import AOS from "aos";
import "aos/dist/aos.css";
import kumpul from "../../assets/kumpul.jpg";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";
import { ContactApi } from "../../libs/api/ContactApi";

export default function ProfilDesa() {
  const { t } = useTranslation();

  // Function to translate dynamic contact types
  const translateContactType = (type) => {
    const translations = {
      'LOKASI': t('contact.location'),
      'TELEPON': t('contact.phone'), 
      'WHATSAPP': t('contact.whatsapp'),
      'EMAIL': t('contact.email'),
      'WEBSITE': t('contact.website')
    };
    return translations[type] || type;
  };
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // Base URL dari environment variable
  const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

  const iconMap = {
    LOKASI: FaMapMarkerAlt,
    TELEPON: FaPhoneAlt,
    WHATSAPP: FaWhatsapp,
    EMAIL: FaEnvelope,
  };

  const getContactIcon = (type) => {
    return iconMap[type] || FaEnvelope;
  };

  const getContactLink = (contact) => {
    switch (contact.type) {
      case "TELEPON":
        return `tel:${contact.value}`;
      case "WHATSAPP":
        const waNumber = contact.value.startsWith("0")
          ? "62" + contact.value.substring(1)
          : contact.value;
        return `https://wa.me/${waNumber}`;
      case "EMAIL":
        return `mailto:${contact.value}`;
      default:
        return null;
    }
  };

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await ContactApi.getPublic();
      setContacts(response);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchAchievements();
    fetchContacts();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/village-achievements`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Berdasarkan struktur API response, data ada di result.data
      if (result.data && Array.isArray(result.data)) {
        // Transform data untuk menambahkan full image URL
        const transformedData = result.data.map((item) => ({
          ...item,
          // Menambahkan full URL untuk gambar
          imageUrl: item.featured_image
            ? `${BASE_URL}/public/images/${item.featured_image}`
            : kumpul, // fallback image jika tidak ada featured_image
          // Format tanggal jika diperlukan
          year: item.date
            ? new Date(item.date).getFullYear()
            : new Date().getFullYear(),
        }));
        setAchievements(transformedData);
      } else {
        setAchievements([]);
      }
    } catch (err) {
      setError(err.message);
      // Fallback ke data translation jika API gagal
      setAchievements(
        t("profileVillage.achievements", { returnObjects: true }) || []
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextMilestone = () => {
    setActiveMilestone((prev) =>
      prev < achievements.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevMilestone = () => {
    setActiveMilestone((prev) =>
      prev > 0 ? prev - 1 : achievements.length - 1
    );
  };

  return (
    <div className="font-poppins bg-gray-50 pt-[60px] lg:pt-[40px] animate-fade overflow-x-hidden">
      {/* - HERO SECTION */}
      <section className="relative bg-[#FFFDF6]" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div data-aos="fade-right" className="order-2 md:order-1">
            <span className="inline-block px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 mb-3 sm:mb-4 shadow">
              {t("profileVillage.tagline")}
            </span>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
              dangerouslySetInnerHTML={{ __html: t("profileVillage.title") }}
            />
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {t("profileVillage.description")}
            </p>
          </div>
          <div
            className="relative flex justify-center order-1 md:order-2"
            data-aos="zoom-in"
          >
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl w-full md:w-4/5">
              <img
                src={kumpul}
                alt="Warga Desa Berkumpul"
                className="object-cover w-full h-48 sm:h-56 md:h-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* - SEJARAH */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t("profileVillage.historyTitle")}
          </h2>
          <p
            className="text-sm sm:text-base text-gray-700 leading-relaxed text-left sm:text-justify"
            dangerouslySetInnerHTML={{
              __html: t("profileVillage.historyText"),
            }}
          />
        </div>
      </section>

      {/* - VISI & MISI */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        data-aos="fade-up"
      >
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-6 sm:p-8"
          data-aos="fade-right"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4">
            {t("profileVillage.visionTitle")}
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {t("profileVillage.visionText")}
          </p>
        </div>
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-6 sm:p-8"
          data-aos="fade-left"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4">
            {t("profileVillage.missionTitle")}
          </h3>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-2">
            {t("profileVillage.missionList", { returnObjects: true }).map(
              (item, i) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* - Prestasi */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6 sm:mb-8 md:mb-10">
            {t("profileVillage.achievementsTitle")}
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8 md:py-10">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-700"></div>
              <span className="ml-3 text-sm sm:text-base text-gray-600">
                {t("profileVillage.loading")}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm sm:text-base text-red-700">
                {t("profileVillage.errorMessage")}: {error}
              </p>
              <button
                onClick={fetchAchievements}
                className="mt-2 px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                {t("profileVillage.retryButton")}
              </button>
            </div>
          )}

          {/* Achievements List */}
          {!loading && achievements.length > 0 && (
            <>
              <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-8 sm:mb-12 md:mb-16">
                {achievements.map((item, index) => (
                  <Link
                    to={`/prestasi/${item.id}`}
                    key={item.id || index}
                    className="block"
                  >
                    <div
                      className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center bg-gray-50 rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      data-aos="fade-up"
                    >
                      <img
                        src={item.imageUrl || item.image || kumpul}
                        alt={item.title}
                        className="w-full md:w-1/3 h-48 sm:h-56 object-cover rounded-lg shadow"
                        onError={(e) => {
                          e.target.src = kumpul;
                        }}
                      />
                      <div className="w-full md:w-2/3 text-center md:text-left">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">
                          {item.description}
                        </p>
                        {item.date && (
                          <p className="text-sm text-green-600">
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Timeline - Mobile Vertical, Desktop Horizontal */}
              <div className="w-full py-6 sm:py-8 md:py-10">
                <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-6 sm:mb-10 md:mb-14">
                  {t("profileVillage.timelineTitle")}
                </h3>

                {/* Mobile: Vertical Timeline */}
                <div className="block md:hidden">
                  <div className="relative pl-6 space-y-6">
                    {/* Vertical Line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                    {achievements.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="relative cursor-pointer"
                        onClick={() => {
                          if (item.id)
                            window.location.href = `/prestasi/${item.id}`;
                        }}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute -left-5 top-2 w-5 h-5 rounded-full bg-white border-3 border-green-600 flex items-center justify-center shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100">
                          <div className="text-xs font-semibold text-green-600 mb-1">
                            {item.year || new Date(item.date).getFullYear()}
                          </div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Horizontal Timeline */}
                <div className="hidden md:block relative">
                  {/* Horizontal Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>

                  {/* Timeline Items - No overflow, responsive spacing */}
                  <div className="relative z-10 flex justify-between items-center px-4">
                    {achievements.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="relative flex flex-col items-center max-w-[120px] lg:max-w-[150px]"
                      >
                        {/* Milestone Dot */}
                        <div
                          className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border-4 border-green-600 flex items-center justify-center mb-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 group"
                          onClick={() => {
                            if (item.id) {
                              window.location.href = `/prestasi/${item.id}`;
                            }
                          }}
                        >
                          <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-green-600"></div>

                          {/* Popup - Only on large screens */}
                          <div className="absolute bottom-full mb-3 w-64 p-4 rounded-lg shadow-lg bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-x-1/2 left-1/2 z-20 hidden lg:block">
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-4 bg-white rotate-45"></div>
                            <div className="text-xs font-semibold text-green-600 mb-1">
                              {item.year || new Date(item.date).getFullYear()}
                            </div>
                            <div className="text-sm font-medium text-gray-800 mb-2">
                              {item.title}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="text-xs font-medium text-gray-700 mt-8 text-center">
                          {item.year || new Date(item.date).getFullYear()}
                        </div>
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-1 text-center px-1 line-clamp-2">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && achievements.length === 0 && !error && (
            <div className="text-center py-8 md:py-10">
              <p className="text-sm sm:text-base text-gray-600">
                {t("profileVillage.noAchievements")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* - KONTAK & SOSMED */}
      <section className="bg-white py-8 sm:py-12 md:py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6 sm:mb-8 md:mb-10">
            {t("profileVillage.contactTitle")}
          </h2>
          <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl mx-auto">
            {isLoadingContacts ? (
              <div className="p-6 rounded-xl shadow-lg bg-white text-center">
                <div className="flex justify-center items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">{t("contact.loading")}</p>
                </div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-6 rounded-xl shadow-lg bg-white text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-5 rounded-full">
                    <FaEnvelope className="text-4xl text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {t("contact.noContacts")}
                </h3>
                <p className="text-gray-500">{t("contact.noContactsDesc")}</p>
              </div>
            ) : (
              <>
                {/* Location */}
                {contacts.find(c => c.type === "LOKASI") && (
                  <div
                    className="p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg bg-white flex items-start gap-3 sm:gap-4 hover:shadow-xl transition"
                    data-aos="fade-right"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                      <FaMapMarkerAlt size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                        {translateContactType("LOKASI")}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                        {contacts.find(c => c.type === "LOKASI").value}
                      </p>
                    </div>
                  </div>
                )}

                {/* Other contacts */}
                {contacts.filter(c => c.type !== "LOKASI").length > 0 && (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    data-aos="fade-up"
                  >
                    {contacts.filter(c => c.type !== "LOKASI").map((contact) => {
                      const Icon = getContactIcon(contact.type);
                      const link = getContactLink(contact);
                      const isClickable = link !== null;

                      const CardContent = () => (
                        <>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                            <Icon size={14} className="sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                              {translateContactType(contact.type)}
                            </h4>
                            <p className="text-xs text-gray-700">{contact.value}</p>
                          </div>
                        </>
                      );

                      const baseClasses = "p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-md bg-white flex flex-col items-start gap-2 hover:shadow-xl transition";

                      if (isClickable) {
                        return (
                          <a
                            key={contact.id}
                            href={link}
                            className={baseClasses}
                            target={contact.type === "WHATSAPP" ? "_blank" : undefined}
                            rel={contact.type === "WHATSAPP" ? "noopener noreferrer" : undefined}
                          >
                            <CardContent />
                          </a>
                        );
                      }

                      return (
                        <div key={contact.id} className={baseClasses}>
                          <CardContent />
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* - MAP */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center"
        data-aos="fade-up"
      >
        <div
          className="bg-gradient-to-br from-[#9BEC00]/10 to-[#D2FF72]/20 shadow-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 order-2 md:order-1"
          data-aos="fade-right"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6">
            {t("profileVillage.mapTitle")}
          </h3>
          <ul className="space-y-2 sm:space-y-4 text-gray-800 text-sm sm:text-base md:text-lg">
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
          className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-green-100 order-1 md:order-2"
          data-aos="zoom-in"
        >
          <iframe
            title="Lokasi Desa Babakan Asem"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50846.83215472047!2d108.04488070198364!3d-6.7568080545342095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2aaf583cd373%3A0x997e0a8c838d37df!2sBabakan%20Asem%2C%20Kec.%20Conggeang%2C%20Kabupaten%20Sumedang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1753327873604!5m2!1sid!2sid"
            width="100%"
            height="300"
            className="sm:h-80 md:h-96"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
