import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Administrasi() {
  // Proper hooks integration
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate AOS animations
    const elements = document.querySelectorAll("[data-aos]");
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      }, index * 150);
    });
  }, []);

  // SVG Icons Components (unchanged)
  const MailIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const UsersIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const ArrowRightIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );

  const QuestionIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ClockIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const BoltIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );

  const EyeIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const ChartIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  // Service configuration with proper routing
  const services = [
    {
      title: t("administrasi.services.0.title"),
      desc: t("administrasi.services.0.desc"),
      button: t("administrasi.services.0.button"),
      icon: <MailIcon className="w-12 h-12" />,
      route: "/surat-pengantar",
    },
    {
      title: t("administrasi.services.2.title"),
      desc: t("administrasi.services.2.desc"),
      button: t("administrasi.services.2.button"),
      icon: <UsersIcon className="w-12 h-12" />,
      route: "/infografis/penduduk",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section dengan Tombol */}
        <div
          className="text-center mb-12 opacity-0 transform translate-y-8 transition-all duration-800"
          data-aos="fade-up"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("administrasi.title")}
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("administrasi.subtitle")}
          </p>

          {/* Tombol Aksi Cepat - FIXED NAVIGATION */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/surat-pengantar")}
              className="group bg-lime-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                {t("administrasi.topButtons.ajukan")}
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => navigate("/panduan")}
              className="group bg-white text-gray-700 font-semibold px-8 py-3 rounded-full border-2 border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                {t("administrasi.topButtons.panduan")}
                <QuestionIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Penjelasan Layanan */}
        <div
          className="mb-12 opacity-0 transform translate-y-8 transition-all duration-800"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("administrasi.featuredTitle")}
              </h2>
              <div className="w-24 h-1 bg-lime-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Layanan Surat Pengantar */}
              <div className="group">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-lime-50 to-green-50 border border-lime-100 group-hover:shadow-md transition-all duration-300 hover:border-lime-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MailIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {t("administrasi.onlineLetterService.title")}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {t("administrasi.onlineLetterService.desc")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-lime-100 text-lime-700 text-xs rounded-full">
                        <ClockIcon className="w-3 h-3" />
                        {t("administrasi.onlineLetterService.features.online")}
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <BoltIcon className="w-3 h-3" />
                        {t("administrasi.onlineLetterService.features.fast")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layanan Data Penduduk */}
              <div className="group">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 group-hover:shadow-md transition-all duration-300 hover:border-blue-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ChartIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {t("administrasi.populationInfoService.title")}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {t("administrasi.populationInfoService.desc")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        <EyeIcon className="w-3 h-3" />
                        {t(
                          "administrasi.populationInfoService.features.realtime"
                        )}
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        <ChartIcon className="w-3 h-3" />
                        {t(
                          "administrasi.populationInfoService.features.visual"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Layanan Aksi - FIXED NAVIGATION */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 opacity-0 transform translate-y-8 transition-all duration-800"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="group opacity-0 transform scale-95 transition-all duration-800"
              data-aos="zoom-in"
              data-aos-delay={500 + index * 100}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col hover:border-lime-200">
                {/* Icon dengan gradient background */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    {service.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-lime-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                </div>

                {/* Content */}
                <div className="text-center flex-grow">
                  <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-lime-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Action Button - FIXED NAVIGATION */}
                <button
                  onClick={() => navigate(service.route)}
                  className="w-full bg-gradient-to-r from-lime-400 to-green-500 text-white font-semibold px-6 py-4 rounded-2xl hover:from-lime-500 hover:to-green-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    {service.button}
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div
          className="text-center mt-12 opacity-0 transform translate-y-8 transition-all duration-800"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">
              💡{" "}
              <span className="font-medium">{t("administrasi.footerTip")}</span>
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>🕒 {t("administrasi.footerFeatures.service247")}</span>
              <span>📱 {t("administrasi.footerFeatures.mobileFriendly")}</span>
              <span>🔒 {t("administrasi.footerFeatures.secure")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
