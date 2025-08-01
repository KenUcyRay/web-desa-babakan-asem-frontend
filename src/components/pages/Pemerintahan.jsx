import { useEffect, useState } from "react";
import { FaFlag, FaUsers, FaHome, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../libs/alert";
import { MemberApi } from "../../libs/api/MemberApi";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function Pemerintahan() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const regulasi = [
    {
      judul: t("government.regulation1Title"),
      tahun: "01/2021",
      file: "/files/regulasi/perdes-tentang-desa.pdf",
    },
    {
      judul: t("government.regulation2Title"),
      tahun: "02/2023",
      file: "/files/regulasi/perdes-rencana-pembangunan.pdf",
    },
  ];

  const lembagaDesa = [
    { nama: t("government.org1"), icon: <FaFlag />, path: "/bumdes" },
    { nama: t("government.org2"), icon: <FaUsers />, path: "/dpd" },
    { nama: t("government.org3"), icon: <FaHome />, path: "/karang-taruna" },
  ];

  const layananAdmin = [
    { nama: t("government.service1"), path: "/surat-pengantar" },
    { nama: t("government.service2"), path: "/formulir-layanan" },
    { nama: t("government.service3"), path: "/layanan-online" },
  ];

  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("PEMERINTAH", 1, 4);
    const responseBody = await response.json();
    if (!response.ok) {
      let errorMessage = "Gagal mengambil data.";
      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    setMembers(responseBody.members);
  };

  useEffect(() => {
    fetchMembers();
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="font-poppins bg-gray-50">
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div data-aos="fade-right" className="text-left">
              <h1
                className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                dangerouslySetInnerHTML={{ __html: t("government.title") }}
              />
              <p
                className="text-gray-600 mt-4 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("government.subtitle") }}
              />
            </div>
            <div className="flex justify-center" data-aos="zoom-in">
              <div className="rounded-2xl overflow-hidden shadow-xl p-6 bg-white">
                <img
                  src={logo}
                  alt="Logo Desa"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>
            </div>
            <div data-aos="fade-left" className="text-left">
              <h2 className="text-2xl font-bold text-green-700 mb-3 tracking-wide">
                {t("government.greetingTitle")}
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify italic font-serif text-[17px]">
                {t("government.greetingMessage")}
              </p>
              <p className="mt-4 font-semibold text-green-800 text-lg">
                {t("government.greetingBy")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-50 py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            {t("government.structureTitle")}
          </h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-center"
                data-aos="zoom-in"
              >
                <img
                  src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                    member.profile_photo
                  }`}
                  alt={member.name}
                  className="w-20 h-20 mx-auto rounded-full border-4 border-gray-100 mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500">{member.position}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {member.term_start} - {member.term_end}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8"
        data-aos="fade-up"
      >
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-right"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            {t("government.orgTitle")}
          </h3>
          <div className="space-y-3">
            {lembagaDesa.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 p-4 rounded-lg border transition"
              >
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="text-green-600">{item.icon}</span>{" "}
                  {item.nama}
                </span>
                <span className="text-gray-400 text-lg">›</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-left"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            {t("government.serviceTitle")}
          </h3>
          <div className="space-y-3">
            {layananAdmin.map((layanan, i) => (
              <button
                key={i}
                onClick={() => navigate(layanan.path)}
                className="w-full bg-gray-50 hover:bg-blue-50 p-4 rounded-lg border transition text-left font-medium text-gray-700"
              >
                {layanan.nama}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t("government.regulationTitle")}
          </h2>
          <div className="overflow-hidden rounded-xl shadow-md">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-4">{t("government.tableTitle")}</th>
                  <th className="p-4">{t("government.tableYear")}</th>
                  <th className="p-4 text-center">
                    {t("government.tableDownload")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {regulasi.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{item.judul}</td>
                    <td className="p-4">{item.tahun}</td>
                    <td className="p-4 text-center">
                      <a
                        href={item.file}
                        download
                        className="text-blue-600 flex items-center gap-1 hover:underline mx-auto justify-center"
                      >
                        <FaDownload /> {t("government.download")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
