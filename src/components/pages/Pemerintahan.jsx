import { useEffect, useState } from "react";
import { FaFlag, FaUsers, FaHome, FaDownload, FaQuoteLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../libs/alert";
import { MemberApi } from "../../libs/api/MemberApi";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Pemerintahan() {
  const navigate = useNavigate();

  const regulasi = [
    {
      judul: "Perdes Tentang Desa",
      tahun: "01/2021",
      file: "/files/regulasi/perdes-tentang-desa.pdf",
    },
    {
      judul: "Perdes Rencana Pembangunan",
      tahun: "02/2023",
      file: "/files/regulasi/perdes-rencana-pembangunan.pdf",
    },
  ];

  const lembagaDesa = [
    { nama: "BUMDes", icon: <FaFlag />, path: "/bumdes" },
    { nama: "DPD", icon: <FaUsers />, path: "/dpd" },
    { nama: "Karang Taruna", icon: <FaHome />, path: "/karang-taruna" },
  ];

  const layananAdmin = [
    { nama: "Surat Pengantar", path: "/surat-pengantar" },
    { nama: "Formulir Layanan", path: "/formulir-layanan" },
    { nama: "Layanan Online", path: "/layanan-online" },
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
      {/* ✅ HERO SECTION */}
      <section className="relative bg-[#FFFDF6]" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div data-aos="fade-right">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 mb-4 shadow">
              Pemerintah Desa
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Pemerintah <span className="text-green-600">Babakan Asem</span>
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Pemerintah Desa Babakan Asem berkomitmen pada transparansi, pelayanan publik, 
              dan pemberdayaan masyarakat untuk mencapai desa yang mandiri, maju, dan sejahtera.
            </p>
          </div>

          {/* Ikon/Ilustrasi */}
          <div className="relative flex justify-center" data-aos="zoom-in">
            <div className="rounded-2xl overflow-hidden shadow-xl w-full md:w-4/5 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 py-16">
              <FaFlag className="text-green-600 text-7xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SAMBUTAN */}
      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FaQuoteLeft className="text-green-500 text-4xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sambutan Kepala Desa</h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            “Kami mengajak seluruh masyarakat Desa Babakan Asem untuk terus bergotong royong 
            membangun desa yang lebih maju, mandiri, dan sejahtera. 
            Partisipasi aktif masyarakat adalah kunci keberhasilan pembangunan desa.”
          </p>
          <p className="mt-4 font-medium text-green-700">- Kepala Desa Babakan Asem</p>
        </div>
      </section>

      {/* ✅ STRUKTUR ORGANISASI */}
      <section className="bg-green-50 py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">Struktur Organisasi</h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-center"
                data-aos="zoom-in"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`}
                  alt={member.name}
                  className="w-20 h-20 mx-auto rounded-full border-4 border-gray-100 mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.position}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {member.term_start} - {member.term_end}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ LEMBAGA & LAYANAN */}
      <section
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8"
        data-aos="fade-up"
      >
        {/* Lembaga Desa */}
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-right"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">Lembaga Desa</h3>
          <div className="space-y-3">
            {lembagaDesa.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 p-4 rounded-lg border transition"
              >
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="text-green-600">{item.icon}</span> {item.nama}
                </span>
                <span className="text-gray-400 text-lg">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layanan Administrasi */}
        <div
          className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8"
          data-aos="fade-left"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">Layanan Administrasi</h3>
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

      {/* ✅ REGULASI */}
      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Regulasi & Peraturan Desa
          </h2>
          <div className="overflow-hidden rounded-xl shadow-md">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-4">Judul Peraturan</th>
                  <th className="p-4">No. / Tahun</th>
                  <th className="p-4 text-center">Unduh</th>
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
                      <button
                        onClick={() => window.open(item.file, "_blank")}
                        className="text-blue-600 flex items-center gap-1 hover:underline mx-auto justify-center"
                      >
                        <FaDownload /> Download
                      </button>
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
