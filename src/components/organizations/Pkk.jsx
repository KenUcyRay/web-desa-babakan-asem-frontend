import { useEffect, useState } from "react";
import { FaWpforms, FaUsers, FaPhotoVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helper } from "../../utils/Helper";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { ProgramApi } from "../../libs/api/ProgramApi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

export default function Pkk() {
  const { t, i18n } = useTranslation();
  const [agenda, setAgenda] = useState([]);
  const [programs, setPrograms] = useState([]);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 3, "PKK", i18n.language);
    if (!response.ok) return;
    const responseBody = await response.json();
    setAgenda(responseBody.agenda);
  };

  const fetchPrograms = async () => {
    const response = await ProgramApi.getPrograms(1, 3, i18n.language);
    if (!response.ok) {
      return;
    }
    const responseBody = await response.json();
    setPrograms(responseBody.programs);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchAgenda();
    fetchPrograms();
  }, [i18n.language]);

  return (
    <div className="font-poppins text-gray-800 bg-gradient-to-b from-green-50 via-white to-green-50">
      <section
        className="max-w-6xl mx-auto px-6 py-16 text-center"
        data-aos="fade-up"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight">
          PKK <span className="text-green-500">{t("pkk.title")}</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          {t("pkk.subtitle")}
        </p>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {t("pkk.description")}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        <div
          className="bg-yellow-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition text-center"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl font-bold text-yellow-800 mb-4">
            {t("pkk.vision")}
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            {t("pkk.visionDesc")}
          </p>
        </div>
        <div
          className="bg-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
            {t("pkk.mission")}
          </h2>
          <ul className="list-disc list-inside text-left space-y-3 text-gray-700">
            {t("pkk.missionList", { returnObjects: true }).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10" data-aos="fade-up">
          {t("pkk.programTitle")}
        </h2>
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {programs.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                  item.featured_image
                }`}
                alt="Program PKK"
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-green-700 text-lg flex items-center gap-2">
                  <FaWpforms /> {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10" data-aos="fade-up">
          {t("pkk.agendaTitle")}
        </h2>
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {agenda.map((item, idx) => (
            <div
              key={item.agenda.id}
              className="bg-white rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={idx * 120}
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                  item.agenda.featured_image
                }`}
                alt={item.agenda.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-green-700 text-lg flex items-center gap-2">
                  <FaUsers /> {item.agenda.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {Helper.truncateText(item.agenda.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="max-w-4xl mx-auto px-6 my-20 text-center"
        data-aos="zoom-in"
      >
        <div className="bg-gradient-to-r from-green-100 to-green-50 p-10 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            {t("pkk.ctaTitle")}
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto mb-6 leading-relaxed">
            {t("pkk.ctaDesc")}
          </p>
          <Link
            to="/pkk/struktur"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl bg-green-600 text-white shadow hover:bg-green-700 hover:scale-105 transition"
          >
            <FaPhotoVideo className="text-2xl" /> {t("pkk.ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
