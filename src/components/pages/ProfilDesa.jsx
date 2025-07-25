import React, { useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import kumpul from "../../assets/kumpul.jpg";
import { useTranslation } from "react-i18next";

export default function ProfilDesa() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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

      {/* - STRUKTUR ORGANISASI */}
      <section className="bg-green-50 py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            {t("profileVillage.structureTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/pemerintahan"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              data-aos="zoom-in"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("profileVillage.headTitle")}
              </h3>
              <p className="text-gray-500">{t("profileVillage.headDesc")}</p>
            </Link>
            <Link
              to="/administrasi"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              data-aos="zoom-in"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("profileVillage.staffTitle")}
              </h3>
              <p className="text-gray-500">{t("profileVillage.staffDesc")}</p>
            </Link>
            <Link
              to="/bpd"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              data-aos="zoom-in"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("profileVillage.bpdTitle")}
              </h3>
              <p className="text-gray-500">{t("profileVillage.bpdDesc")}</p>
            </Link>
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
