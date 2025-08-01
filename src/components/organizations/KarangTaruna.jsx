// Sudah diimplementasikan i18n di file ini
// Gunakan hook useTranslation dan struktur key `karangTaruna.*`

import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { Helper } from "../../utils/Helper";
import { MemberApi } from "../../libs/api/MemberApi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

export default function KarangTaruna() {
  const { t } = useTranslation();
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [members, setMembers] = useState([]);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(currentPage, 3, "KARANG_TARUNA");
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setAgenda(responseBody.agenda);
    } else {
      alert(t("karangTaruna.error"));
    }
  };

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("KARANG_TARUNA");
    const responseBody = await response.json();
    if (!response.ok) {
      await alert(t("karangTaruna.error"));
      return;
    }
    setMembers(responseBody.members);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    fetchAgenda(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchMembers();
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div className="bg-gray-50 py-12 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 font-poppins">
      <div className="text-center mb-16" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#9BEC00] to-[#1ee432] bg-clip-text text-transparent">
          {t("karangTaruna.title")}
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
          {t("karangTaruna.subtitle")}
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden shadow-xl mb-16"
        data-aos="zoom-in"
      >
        <img
          src="https://picsum.photos/1200/500?random=12"
          alt="Karang Taruna"
          className="w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div
          className="p-8 rounded-2xl bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow-md text-center hover:shadow-xl transition"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t("karangTaruna.visionTitle")}
          </h2>
          <p className="text-gray-800 text-lg">{t("karangTaruna.vision")}</p>
        </div>
        <div
          className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-3 text-center">
            {t("karangTaruna.missionTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
            <li>{t("karangTaruna.mission.1")}</li>
            <li>{t("karangTaruna.mission.2")}</li>
            <li>{t("karangTaruna.mission.3")}</li>
          </ul>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl shadow-lg p-10 mb-20"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          {t("karangTaruna.structure")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 text-center">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col items-center"
              data-aos="zoom-in"
              data-aos-delay={idx * 50}
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                  member.profile_photo
                }`}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-[#9BEC00] shadow-md object-cover"
              />
              <p className="font-semibold mt-3">{member.name}</p>
              <p className="text-sm text-gray-500">{member.position}</p>
              <p className="text-xs text-gray-400">
                {member.term_start} - {member.term_end}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2
          className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[#000000] to-[#000000] bg-clip-text text-transparent"
          data-aos="fade-down"
        >
          {t("karangTaruna.galleryTitle")}
        </h2>
        <p
          className="text-gray-600 text-center max-w-2xl mx-auto mb-10"
          data-aos="fade-up"
        >
          {t("karangTaruna.gallerySubtitle")}
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {agenda.map((item, idx) => (
            <div
              key={item.agenda.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition group"
              data-aos="fade-up"
              data-aos-delay={idx * 80}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                    item.agenda.featured_image
                  }`}
                  alt={item.agenda.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                  <span className="text-white font-semibold">
                    📸 {t("karangTaruna.galleryLabel")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">
                  {item.agenda.title}
                </h3>
                {(() => {
                  const { tanggal, waktu } = Helper.formatAgendaDateTime(
                    item.agenda.start_time,
                    item.agenda.end_time
                  );
                  return (
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {item.agenda.location} <br />
                      📅 {tanggal} | ⏰ {waktu}
                    </p>
                  );
                })()}
                <p className="text-gray-600 text-sm mt-3">
                  {truncateText(item.agenda.content, 100)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center" data-aos="fade-up">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
