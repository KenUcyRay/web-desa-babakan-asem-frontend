// VillagePotential.jsx
import React, { useEffect } from "react";
import { FaSeedling, FaHorse, FaTree, FaFish, FaChartLine, FaHandshake } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

// ✅ Import gambar lokal
import tani from "../../assets/sawah.jpeg";
import sapi from "../../assets/sapi.jpeg";
import kebun from "../../assets/kebun.jpeg";
import ikan from "../../assets/sawah.jpeg"; // placeholder for fisheries

export default function PotensiDesa() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const potensiImages = [
    {
      src: tani,
      title: t("villagePotential.carousel1Title"),
      desc: t("villagePotential.carousel1Desc"),
    },
    {
      src: sapi,
      title: t("villagePotential.carousel2Title"),
      desc: t("villagePotential.carousel2Desc"),
    },
    {
      src: kebun,
      title: t("villagePotential.carousel3Title"),
      desc: t("villagePotential.carousel3Desc"),
    },
  ];

  return (
    <div className="bg-gray-50 py-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ✅ JUDUL */}
        <h1
          className="text-3xl md:text-4xl font-bold text-center text-gray-900"
          data-aos="fade-up"
        >
          {t("villagePotential.title")}
        </h1>
        <p
          className="text-center text-gray-600 mt-3 mb-10 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t("villagePotential.subtitle")}
        </p>

        {/* ✅ GRID POTENSI - 4 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Pertanian */}
          <div
            className="bg-white rounded-lg shadow-md p-5"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaSeedling className="text-green-600 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">{t("villagePotential.agricultureTitle")}</h3>
            </div>
            <img
              src={tani}
              alt="Pertanian"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600">
              {t("villagePotential.agricultureDesc")}
            </p>
          </div>

          {/* Peternakan */}
          <div
            className="bg-white rounded-lg shadow-md p-5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaHorse className="text-green-600 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">{t("villagePotential.livestockTitle")}</h3>
            </div>
            <img
              src={sapi}
              alt="Peternakan"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600">
              {t("villagePotential.livestockDesc")}
            </p>
          </div>

          {/* Perkebunan */}
          <div
            className="bg-white rounded-lg shadow-md p-5"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaTree className="text-green-600 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">{t("villagePotential.plantationTitle")}</h3>
            </div>
            <img
              src={kebun}
              alt="Perkebunan"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600">
              {t("villagePotential.plantationDesc")}
            </p>
          </div>

          {/* Perikanan */}
          <div
            className="bg-white rounded-lg shadow-md p-5"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaFish className="text-green-600 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">{t("villagePotential.fisheriesTitle")}</h3>
            </div>
            <img
              src={ikan}
              alt="Perikanan"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600">
              {t("villagePotential.fisheriesDesc")}
            </p>
          </div>
        </div>



        {/* ✅ PROGRAM PENGEMBANGAN */}
        <div className="bg-gradient-to-r from-green-400 to-[#B6F500] rounded-2xl p-8 mb-16 text-white" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            🚀 {t("villagePotentials.developmentTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                {t("villagePotentials.development.agriculture.title")}
              </h3>
              <ul className="space-y-2 text-green-100">
                <li>• {t("villagePotentials.development.agriculture.item1")}</li>
                <li>• {t("villagePotentials.development.agriculture.item2")}</li>
                <li>• {t("villagePotentials.development.agriculture.item3")}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                {t("villagePotentials.development.livestock.title")}
              </h3>
              <ul className="space-y-2 text-green-100">
                <li>• {t("villagePotentials.development.livestock.item1")}</li>
                <li>• {t("villagePotentials.development.livestock.item2")}</li>
                <li>• {t("villagePotentials.development.livestock.item3")}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                {t("villagePotentials.development.agrotourism.title")}
              </h3>
              <ul className="space-y-2 text-green-100">
                <li>• {t("villagePotentials.development.agrotourism.item1")}</li>
                <li>• {t("villagePotentials.development.agrotourism.item2")}</li>
                <li>• {t("villagePotentials.development.agrotourism.item3")}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                {t("villagePotentials.development.digital.title")}
              </h3>
              <ul className="space-y-2 text-green-100">
                <li>• {t("villagePotentials.development.digital.item1")}</li>
                <li>• {t("villagePotentials.development.digital.item2")}</li>
                <li>• {t("villagePotentials.development.digital.item3")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ CAROUSEL FOTO POTENSI */}
        <div data-aos="zoom-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t("villagePotential.carouselTitle")}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t("villagePotential.carouselSubtitle")}
          </p>

          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
          >
            {potensiImages.map((item, index) => (
              <div key={index}>
                <img
                  src={item.src}
                  alt={item.title}
                  className="rounded-lg shadow-md"
                />
                <p className="legend">
                  <strong>{item.title}</strong> – {item.desc}
                </p>
              </div>
            ))}
          </Carousel>
        </div>

        {/* ✅ CALL TO ACTION */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-16 text-center" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            🤝 {t("villagePotentials.cta.title")}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t("villagePotentials.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/kontak" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer">
              {t("villagePotentials.cta.contact")}
            </a>
            <a href="/bumdes" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition cursor-pointer">
              {t("villagePotentials.cta.products")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
