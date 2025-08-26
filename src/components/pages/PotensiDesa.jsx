// VillagePotential.jsx
import React, { useEffect } from "react";
import { FaSeedling, FaHorse, FaTree } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

// ✅ Import gambar lokal
import tani from "../../assets/sawah.jpeg";
import sapi from "../../assets/sapi.jpeg";
import kebun from "../../assets/kebun.jpeg";

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

        {/* ✅ GRID POTENSI */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] mb-16">
          {/* Pertanian */}
          <div
            className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition"
            data-aos="fade-right"
          >
            <img
              src={tani}
              alt="Pertanian"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaSeedling /> {t("villagePotential.agricultureTitle")}
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                {t("villagePotential.agricultureDesc")}
              </p>
            </div>
          </div>

          {/* Peternakan */}
          <div
            className="bg-orange-50 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition"
            data-aos="fade-up"
          >
            <img
              src={sapi}
              alt="Peternakan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaHorse /> {t("villagePotential.livestockTitle")}
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                {t("villagePotential.livestockDesc")}
              </p>
            </div>
          </div>

          {/* Perkebunan */}
          <div
            className="bg-blue-50 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition md:col-span-2"
            data-aos="fade-left"
          >
            <img
              src={kebun}
              alt="Perkebunan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaTree /> {t("villagePotential.plantationTitle")}
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                {t("villagePotential.plantationDesc")}
              </p>
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
      </div>
    </div>
  );
}
