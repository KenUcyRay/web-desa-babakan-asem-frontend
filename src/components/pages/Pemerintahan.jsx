import { useEffect, useState } from "react";
import { FaFlag, FaUsers, FaHome, FaDownload, FaFileAlt, FaPhone, FaMapMarkerAlt, FaClock, FaExternalLinkAlt, FaShieldAlt, FaExclamationTriangle, FaLifeRing, FaIdCard, FaEnvelope, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MemberApi } from "../../libs/api/MemberApi";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function Pemerintahan() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
    { 
      nama: i18n.language === 'en' ? 'BUMDes (Village-Owned Enterprises)' : t("government.org1"), 
      icon: <FaFlag />, 
      path: "/bumdes" 
    },
    { 
      nama: i18n.language === 'en' ? 'Youth Organization (Karang Taruna)' : t("government.org3"), 
      icon: <FaHome />, 
      path: "/karang-taruna" 
    },
    { 
      nama: i18n.language === 'en' ? 'BPD (Village Consultative Body)' : "BPD (Badan Permusyawaratan Desa)", 
      icon: <FaUsers />, 
      path: "/bpd" 
    },
    { 
      nama: i18n.language === 'en' ? 'PKK (Family Welfare Empowerment)' : "PKK (Pemberdayaan Kesejahteraan Keluarga)", 
      icon: <FaUsers />, 
      path: "/pkk" 
    },
  ];

  const layananAdmin = [
    { nama: t("government.service1"), path: "/surat-pengantar" },
  ];

  const [members, setMembers] = useState([]);
  const [pdfModal, setPdfModal] = useState({ isOpen: false, title: '', url: '' });

  const openPdfModal = (title, url) => {
    setPdfModal({ isOpen: true, title, url });
  };

  const closePdfModal = () => {
    setPdfModal({ isOpen: false, title: '', url: '' });
  };

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers(
      "PEMERINTAH",
      1,
      4,
      i18n.language
    );
    const responseBody = await response.json();
    if (!response.ok) return;

    setMembers(responseBody.members);
  };

  useEffect(() => {
    fetchMembers();
    AOS.init({ duration: 800, once: true });
  }, [i18n.language]);

  return (
    <div className="font-poppins bg-gray-50 pt-[60px] lg:pt-[40px] animate-fade">
      {/* Header Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
            {/* Teks Kiri */}
            <div
              data-aos="fade-right"
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4"
                dangerouslySetInnerHTML={{ __html: t("government.title") }}
              />
              <p
                className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("government.subtitle") }}
              />
            </div>

            {/* Logo Tengah */}
            <div
              className="flex justify-center order-1 lg:order-2"
              data-aos="zoom-in"
            >
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 bg-white">
                <img
                  src={logo}
                  alt="Logo Desa"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Sambutan Kanan */}
            <div
              data-aos="fade-left"
              className="text-center lg:text-left order-3 lg:order-3"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 mb-2 sm:mb-3 tracking-wide">
                {t("government.greetingTitle")}
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify italic font-serif text-xs sm:text-sm md:text-base">
                {t("government.greetingMessage")}
              </p>
              <p className="mt-3 sm:mt-4 font-semibold text-green-800 text-sm sm:text-base md:text-lg">
                {t("government.greetingBy")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Pemerintahan */}
      <section
        className="bg-green-50 py-12 sm:py-16 md:py-20"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-8 sm:mb-12">
            {t("government.structureTitle")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition text-center"
                data-aos="zoom-in"
              >
                <img
                  src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                    member.profile_photo
                  }`}
                  alt={member.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 sm:border-4 border-gray-100 mb-2 sm:mb-4 object-cover"
                />
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-1 leading-tight">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 leading-tight">
                  {member.position}
                </p>
                <p className="text-xs text-gray-400">
                  {member.term_start} - {member.term_end}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lembaga & Informasi */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        data-aos="fade-up"
      >
        {/* Lembaga Desa */}
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          data-aos="fade-right"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <FaUsers className="text-green-600 text-xl sm:text-2xl" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">
              {t("government.orgTitle")}
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {lembagaDesa.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition text-xs sm:text-sm md:text-base min-w-0"
              >
                <span className="flex items-center gap-2 text-gray-700 font-medium flex-1 min-w-0">
                  <span className="text-green-600 flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.nama}</span>
                </span>
                <span className="text-gray-400 text-lg flex-shrink-0 ml-2">
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jam Pelayanan */}
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          data-aos="fade-left"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <FaClock className="text-green-600 text-xl sm:text-2xl" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">
              {i18n.language === 'en' ? 'Service Hours' : 'Jam Pelayanan'}
            </h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-gray-800">{i18n.language === 'en' ? 'Monday - Friday' : 'Senin - Jumat'}</p>
              <p className="text-sm">08:00 - 16:00 WIB</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-gray-800">{i18n.language === 'en' ? 'Saturday' : 'Sabtu'}</p>
              <p className="text-sm">08:00 - 12:00 WIB</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800">{i18n.language === 'en' ? 'Sunday & Holidays' : 'Minggu & Hari Libur'}</p>
              <p className="text-sm text-red-600">{i18n.language === 'en' ? 'Closed' : 'Tutup'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regulasi */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6 md:mb-8">
            <FaFileAlt className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t("government.regulationTitle")}
            </h2>
          </div>

          {/* Mobile: Card Layout */}
          <div className="block md:hidden space-y-3 sm:space-y-4">
            {regulasi.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition text-left"
              >
                <h4 className="font-semibold text-gray-800 text-sm mb-2 leading-tight">
                  {item.judul}
                </h4>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{item.tahun}</p>
                  <button
                    onClick={() => openPdfModal(item.judul, item.file)}
                    className="text-blue-600 flex items-center gap-1 hover:underline text-xs"
                  >
                    <FaFileAlt size={12} /> Preview
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full text-left text-gray-700 text-sm lg:text-base">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-3 lg:p-4">{t("government.tableTitle")}</th>
                  <th className="p-3 lg:p-4">{t("government.tableYear")}</th>
                  <th className="p-3 lg:p-4 text-center">
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
                    <td className="p-3 lg:p-4 break-words">{item.judul}</td>
                    <td className="p-3 lg:p-4">{item.tahun}</td>
                    <td className="p-3 lg:p-4 text-center">
                      <button
                        onClick={() => openPdfModal(item.judul, item.file)}
                        className="text-blue-600 flex items-center gap-1 hover:underline mx-auto justify-center text-sm"
                      >
                        <FaFileAlt size={14} /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Informasi Pelayanan Administrasi */}
      <section className="bg-green-50 py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaIdCard className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
              {t("government.adminServices.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("government.adminServices.documents.title")}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t("government.adminServices.documents.ktp")}</li>
                <li>• {t("government.adminServices.documents.kk")}</li>
                <li>• {t("government.adminServices.documents.skck")}</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("government.adminServices.requirements.title")}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {i18n.language === 'en' ? 'NIK (National Identity Number)' : 'NIK (Nomor Induk Kependudukan)'}</li>
                <li>• {i18n.language === 'en' ? 'Full Name' : 'Nama Lengkap'}</li>
                <li>• {t("government.adminServices.requirements.form")}</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {i18n.language === 'en' ? 'Service Access' : 'Akses Layanan'}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">
                {i18n.language === 'en' 
                  ? 'Submit requests for cover letters and other administrative documents online.' 
                  : 'Ajukan permohonan surat pengantar dan dokumen administrasi lainnya secara online.'}
              </p>
              <button
                onClick={() => navigate('/surat-pengantar')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <FaFileAlt /> {i18n.language === 'en' ? 'Create Request' : 'Buat Permohonan'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak dan Layanan Pengaduan */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaPhone className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t("government.contact.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("government.contact.office.title")}
              </h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>{t("government.contact.office.address")}</strong></p>
                <p>{t("government.contact.office.fullAddress")}</p>
                <p><strong>{t("government.contact.office.phone")}</strong> (0261) 123-456</p>
                <p><strong>{t("government.contact.office.hours")}</strong> {t("government.contact.office.workingHours")}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("government.contact.complaints.title")}
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>• {t("government.contact.complaints.direct")}</p>
                <p>• {t("government.contact.complaints.phone")}</p>
                <p>• {t("government.contact.complaints.email")}</p>
                <p>• {t("government.contact.complaints.online")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Link Terkait */}
      <section className="bg-green-50 py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaExternalLinkAlt className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
              {t("government.relatedLinks.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a href="https://sumedangkab.go.id" target="_blank" rel="noopener noreferrer" 
               className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <h3 className="font-bold text-gray-800 mb-2">{t("government.relatedLinks.regency")}</h3>
              <p className="text-gray-600 text-sm">{t("government.relatedLinks.regencyDesc")}</p>
            </a>
            <a href="https://jabar.go.id" target="_blank" rel="noopener noreferrer"
               className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <h3 className="font-bold text-gray-800 mb-2">{t("government.relatedLinks.province")}</h3>
              <p className="text-gray-600 text-sm">{t("government.relatedLinks.provinceDesc")}</p>
            </a>
            <a href="https://kemendesa.go.id" target="_blank" rel="noopener noreferrer"
               className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <h3 className="font-bold text-gray-800 mb-2">{t("government.relatedLinks.ministry")}</h3>
              <p className="text-gray-600 text-sm">{t("government.relatedLinks.ministryDesc")}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Informasi Bencana dan Kesiapsiagaan */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaShieldAlt className="text-red-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t("government.disaster.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4">
                {t("government.disaster.potential.title")}
              </h3>
              <ul className="space-y-2 text-red-700">
                <li>• {t("government.disaster.potential.flood")}</li>
                <li>• {t("government.disaster.potential.landslide")}</li>
                <li>• {t("government.disaster.potential.earthquake")}</li>
                <li>• {t("government.disaster.potential.drought")}</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4">
                {t("government.disaster.preparedness.title")}
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li>• {t("government.disaster.preparedness.plan")}</li>
                <li>• {t("government.disaster.preparedness.supplies")}</li>
                <li>• {t("government.disaster.preparedness.routes")}</li>
                <li>• {t("government.disaster.preparedness.contact")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      {pdfModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {pdfModal.title}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={pdfModal.url}
                  download
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <FaDownload size={14} /> Download
                </a>
                <button
                  onClick={closePdfModal}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <FaFileAlt size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">PDF Preview</p>
                  <p className="text-sm mb-4">Dummy PDF content would be displayed here</p>
                  <div className="bg-white p-6 rounded border-2 border-dashed border-gray-300 max-w-md mx-auto">
                    <h4 className="font-bold text-gray-800 mb-2">PERATURAN DESA</h4>
                    <p className="text-sm text-gray-600 mb-2">Nomor: {pdfModal.url.includes('01/2021') ? '01/2021' : '02/2023'}</p>
                    <p className="text-xs text-gray-500">Tentang: {pdfModal.title}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      <p>--- Dummy PDF Content ---</p>
                      <p>This is a preview placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
