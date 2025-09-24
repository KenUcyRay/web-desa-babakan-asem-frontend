// src/components/pages/Pemerintahan.jsx
import { useEffect, useState } from "react";
import {
  FaFlag,
  FaUsers,
  FaHome,
  FaDownload,
  FaFileAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaLifeRing,
  FaIdCard,
  FaEnvelope,
  FaTimes,
  FaChevronRight,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MemberApi } from "../../libs/api/MemberApi";
import { RegulationApi } from "../../libs/api/RegulationApi";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function Pemerintahan() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // members (struktur pemerintahan)
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // regulations (dari API)
  const [regulations, setRegulations] = useState([]);
  const [loadingRegulations, setLoadingRegulations] = useState(true);

  // modal untuk preview PDF - sekarang menyimpan id, title, dan url
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    id: null,
    title: "",
    url: "",
  });

  // optional: service hours toggles / states
  const serviceHours = [
    { day: "Monday - Friday", time: "08:00 - 16:00 WIB" },
    { day: "Saturday", time: "08:00 - 12:00 WIB" },
    { day: "Sunday & Holidays", time: "Closed" },
  ];

  // lembaga desa (static but i18n-aware)
  const lembagaDesa = [
    {
      nama:
        i18n.language === "en"
          ? "BUMDes (Village-Owned Enterprises)"
          : t("government.org1"),
      icon: <FaFlag />,
      path: "/bumdes",
    },
    {
      nama:
        i18n.language === "en"
          ? "Youth Organization (Karang Taruna)"
          : t("government.org3"),
      icon: <FaHome />,
      path: "/karang-taruna",
    },
    {
      nama:
        i18n.language === "en"
          ? "BPD (Village Consultative Body)"
          : "BPD (Badan Permusyawaratan Desa)",
      icon: <FaUsers />,
      path: "/bpd",
    },
    {
      nama:
        i18n.language === "en"
          ? "PKK (Family Welfare Empowerment)"
          : "PKK (Pemberdayaan Kesejahteraan Keluarga)",
      icon: <FaUsers />,
      path: "/pkk",
    },
  ];

  // layanan administrasi (static, translasi-ready)
  const layananAdmin = [
    { nama: t("government.service1"), path: "/surat-pengantar" },
    // tambahan contoh
    { nama: t("government.service2") || "Akta Kelahiran", path: "/akta-kelahiran" },
    { nama: t("government.service3") || "Kartu Keluarga", path: "/kk" },
  ];

  // fetch members (struktur pemerintahan)
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await MemberApi.getMembers("PEMERINTAH", 1, 12, i18n.language);
      // MemberApi returns fetch Response; follow pattern in other code
      const responseBody = await response.json();
      if (!response.ok) {
        console.warn("MemberApi.getMembers not ok", responseBody);
        setMembers([]);
        return;
      }
      setMembers(responseBody.members || []);
    } catch (err) {
      console.error("fetchMembers error", err);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // fetch regulations (RegulationApi)
  const fetchRegulations = async () => {
    setLoadingRegulations(true);
    try {
      const response = await RegulationApi.getAll();
      // RegulationApi.getAll returns object { success, data, errors } per our earlier design
      if (response && response.success) {
        // normalize: ensure entries have id,title,year,fileName,createdAt
        const regs = (response.data || []).map((r) => ({
          id: r.id ?? r._id ?? r.regulation_id ?? null,
          title: r.title ?? r.name ?? r.judul ?? "Untitled",
          year: r.year ?? r.tahun ?? "",
          fileName: r.fileName ?? r.file_name ?? r.file ?? "",
          createdAt: r.createdAt ?? r.created_at ?? r.uploaded_at ?? null,
        }));
        setRegulations(regs);
      } else {
        console.warn("RegulationApi.getAll returned false", response);
        setRegulations([]);
      }
    } catch (err) {
      console.error("fetchRegulations error", err);
      setRegulations([]);
    } finally {
      setLoadingRegulations(false);
    }
  };

  useEffect(() => {
    // init animation library
    AOS.init({ duration: 800, once: true });

    // initial fetch
    fetchMembers();
    fetchRegulations();

    // re-run when language changes
  }, [i18n.language]);

  // Modal controls - sekarang menyimpan id untuk download yang benar
  const openPdfModal = (title, regulationId) => {
    // Gunakan getPreviewUrl untuk preview di iframe
    const previewUrl = RegulationApi.getPreviewUrl(regulationId);
    setPdfModal({ 
      isOpen: true, 
      id: regulationId, 
      title, 
      url: previewUrl 
    });
  };
  
  const closePdfModal = () => {
    setPdfModal({ isOpen: false, id: null, title: "", url: "" });
  };

  // Helper: compute download url via RegulationApi.getDownloadUrl
  const getDownloadUrl = (id) => {
    try {
      return RegulationApi.getDownloadUrl(id);
    } catch (err) {
      console.error("getDownloadUrl error", err);
      return "#";
    }
  };

  // Helper: compute preview url via RegulationApi.getPreviewUrl
  const getPreviewUrl = (id) => {
    try {
      return RegulationApi.getPreviewUrl(id);
    } catch (err) {
      console.error("getPreviewUrl error", err);
      return "#";
    }
  };

  return (
    <div className="font-poppins bg-gray-50 pt-[60px] lg:pt-[40px] animate-fade overflow-x-hidden">
      {/* =========================
          Header / Hero
          ========================= */}
      <section className="bg-white py-12 sm:py-16 md:py-20" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
            {/* Left - Title */}
            <div data-aos="fade-right" className="text-center lg:text-left order-2 lg:order-1">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4"
                dangerouslySetInnerHTML={{ __html: t("government.title") }}
              />
              <p
                className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("government.subtitle") }}
              />
            </div>

            {/* Center - Logo */}
            <div className="flex justify-center order-1 lg:order-2" data-aos="zoom-in">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 bg-white">
                <img src={logo} alt="Logo Desa" className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain mx-auto" />
              </div>
            </div>

            {/* Right - Sambutan */}
            <div data-aos="fade-left" className="text-center lg:text-left order-3 lg:order-3">
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

      {/* =========================
          Struktur Pemerintahan
          ========================= */}
      <section className="bg-green-50 py-12 sm:py-16 md:py-20" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-8 sm:mb-12">
            {t("government.structureTitle")}
          </h2>

          {loadingMembers ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">{t("common.loading") || "Loading..."}</p>
            </div>
          ) : members.length === 0 ? (
            <p className="text-gray-500">{t("government.noMembers") || "No government members found."}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition text-center"
                  data-aos="zoom-in"
                >
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${member.profile_photo}`}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 sm:border-4 border-gray-100 mb-2 sm:mb-4 object-cover"
                  />
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-sm font-semibold text-gray-800 mb-1 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 leading-tight">{member.position}</p>
                  <p className="text-xs text-gray-400">{member.term_start} - {member.term_end}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          Lembaga Desa & Jam Pelayanan
          ========================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8" data-aos="fade-up">
        {/* Lembaga */}
        <div className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8" data-aos="fade-right">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <FaUsers className="text-green-600 text-xl sm:text-2xl" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">{t("government.orgTitle")}</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {lembagaDesa.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition text-xs sm:text-sm md:text-base min-w-0"
              >
                <span className="flex items-center gap-2 text-gray-700 font-medium flex-1 min-w-0">
                  <span className="text-green-600 flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.nama}</span>
                </span>
                <span className="text-gray-400 text-lg flex-shrink-0 ml-2">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Jam Pelayanan */}
        <div className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8" data-aos="fade-left">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <FaClock className="text-green-600 text-xl sm:text-2xl" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">{i18n.language === "en" ? "Service Hours" : "Jam Pelayanan"}</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            {serviceHours.map((s, idx) => (
              <div key={idx} className={`rounded-lg p-3 ${s.time === "Closed" ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}>
                <p className={`font-semibold ${s.time === "Closed" ? "text-red-800" : "text-gray-800"}`}>{s.day}</p>
                <p className="text-sm">{s.time}</p>
              </div>
            ))}
            <div className="mt-3 text-xs text-gray-500">
              <strong>Timezone:</strong> UTC+7 (WIB)
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Regulasi (dari API)
          ========================= */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6 md:mb-8">
            <FaFileAlt className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t("government.regulationTitle")}</h2>
          </div>

          {loadingRegulations ? (
            <div className="text-gray-500">Loading regulations...</div>
          ) : regulations.length === 0 ? (
            <div className="text-gray-500">No regulations available</div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="block md:hidden space-y-3 sm:space-y-4">
                {regulations.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition text-left">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2 leading-tight">{item.title}</h4>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{item.year}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openPdfModal(item.title, item.id)} 
                          className="text-blue-600 flex items-center gap-1 hover:underline text-xs"
                        >
                          <FaFileAlt size={12} /> Preview
                        </button>
                        <a 
                          href={getDownloadUrl(item.id)} 
                          className="text-gray-600 flex items-center gap-1 hover:underline text-xs" 
                          download
                        >
                          <FaDownload size={12} /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-xl shadow-md">
                <table className="min-w-full text-left text-gray-700 text-sm lg:text-base">
                  <thead className="bg-gray-100 text-gray-800">
                    <tr>
                      <th className="p-3 lg:p-4">{t("government.tableTitle")}</th>
                      <th className="p-3 lg:p-4">{t("government.tableYear")}</th>
                      <th className="p-3 lg:p-4 text-center">{t("government.tableDownload")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regulations.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 lg:p-4 break-words">{item.title}</td>
                        <td className="p-3 lg:p-4">{item.year}</td>
                        <td className="p-3 lg:p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => openPdfModal(item.title, item.id)} 
                              className="text-blue-600 flex items-center gap-1 hover:underline mx-auto justify-center text-sm"
                            >
                              <FaFileAlt size={14} /> Preview
                            </button>
                            <a 
                              href={getDownloadUrl(item.id)} 
                              download 
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <FaDownload />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================
          Informasi Pelayanan Administrasi
          ========================= */}
      <section className="bg-green-50 py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaIdCard className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{t("government.adminServices.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t("government.adminServices.documents.title")}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t("government.adminServices.documents.ktp")}</li>
                <li>• {t("government.adminServices.documents.kk")}</li>
                <li>• {t("government.adminServices.documents.skck")}</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t("government.adminServices.requirements.title")}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {i18n.language === "en" ? "NIK (National Identity Number)" : "NIK (Nomor Induk Kependudukan)"}</li>
                <li>• {i18n.language === "en" ? "Full Name" : "Nama Lengkap"}</li>
                <li>• {t("government.adminServices.requirements.form")}</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{i18n.language === "en" ? "Service Access" : "Akses Layanan"}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">
                {i18n.language === "en"
                  ? "Submit requests for cover letters and other administrative documents online."
                  : "Ajukan permohonan surat pengantar dan dokumen administrasi lainnya secara online."}
              </p>
              <button onClick={() => navigate("/surat-pengantar")} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                <FaFileAlt /> {i18n.language === "en" ? "Create Request" : "Buat Permohonan"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Kontak & Layanan Pengaduan
          ========================= */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaPhone className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t("government.contact.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t("government.contact.office.title")}</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>{t("government.contact.office.address")}</strong></p>
                <p>{t("government.contact.office.fullAddress")}</p>
                <p><strong>{t("government.contact.office.phone")}</strong> (0261) 123-456</p>
                <p><strong>{t("government.contact.office.hours")}</strong> {t("government.contact.office.workingHours")}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t("government.contact.complaints.title")}</h3>
              <div className="space-y-3 text-gray-700">
                <p>• {t("government.contact.complaints.direct")}</p>
                <p>• {t("government.contact.complaints.phone")}</p>
                <p>• {t("government.contact.complaints.email")}</p>
                <p>• {t("government.contact.complaints.online")}</p>
                <div className="mt-4">
                  <a href="mailto:pengaduan@desa.id" className="text-green-700 hover:underline flex items-center gap-2"><FaEnvelope /> pengaduan@desa.id</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Link Terkait
          ========================= */}
      <section className="bg-green-50 py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaExternalLinkAlt className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{t("government.relatedLinks.title")}</h2>
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

      {/* =========================
          Informasi Bencana & Kesiapsiagaan
          ========================= */}
      <section className="bg-white py-8 sm:py-10 md:py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <FaShieldAlt className="text-red-600 text-xl sm:text-2xl md:text-3xl" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t("government.disaster.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4">{t("government.disaster.potential.title")}</h3>
              <ul className="space-y-2 text-red-700">
                <li>• {t("government.disaster.potential.flood")}</li>
                <li>• {t("government.disaster.potential.landslide")}</li>
                <li>• {t("government.disaster.potential.earthquake")}</li>
                <li>• {t("government.disaster.potential.drought")}</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4">{t("government.disaster.preparedness.title")}</h3>
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

      {/* =========================
          PDF Modal (Preview + Download)
          ========================= */}
      {pdfModal.isOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-4">{pdfModal.title}</h3>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a 
                  href={getDownloadUrl(pdfModal.id)} 
                  download 
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  <FaDownload size={14} /> Download
                </a>
                <button 
                  onClick={closePdfModal} 
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-gray-100">
              {/* iframe preview dengan URL preview yang benar */}
              <iframe 
                src={`${pdfModal.url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} 
                title="PDF Preview" 
                className="w-full h-full rounded border shadow-inner bg-white" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}