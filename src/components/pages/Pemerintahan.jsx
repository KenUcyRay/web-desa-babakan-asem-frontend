import { useEffect, useState } from "react";
import { FaFlag, FaUsers, FaHome, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../libs/alert";
import { MemberApi } from "../../libs/api/MemberApi";

export default function Pemerintahan() {
  const navigate = useNavigate();

  const regulasi = [
    { judul: "Perdes Tentang Desa", tahun: "01/2021" },
    { judul: "Perdes Rencana Pembangunan", tahun: "02/2023" },
  ];

  const lembagaDesa = [
    { nama: "BUMDes", icon: <FaFlag />, path: "/bumdes" },
    { nama: "Dpd", icon: <FaUsers />, path: "/dpd" },
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
  }, []);

  return (
    <div className="bg-gray-50 py-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ✅ Judul Halaman */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Pemerintah Desa
        </h1>
        <p className="text-center text-gray-600 mt-3 mb-10 max-w-2xl mx-auto leading-relaxed">
          Pemerintah Desa Babakan Asem berkomitmen pada transparansi & partisipasi
          masyarakat demi kesejahteraan bersama.
        </p>

        {/* ✅ Struktur Organisasi */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Struktur Organisasi
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-center">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center hover:scale-105 hover:shadow-md transition rounded-xl p-4"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-sm mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-800 text-lg">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.position}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {member.term_start} - {member.term_end}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Lembaga Kemasyarakatan & Layanan */}
        <h2 className="text-2xl font-semibold text-center mb-8">
          Lembaga Kemasyarakatan & Layanan Administrasi
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* ✅ Lembaga Desa */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Lembaga Desa
            </h3>
            <div className="space-y-3">
              {lembagaDesa.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between bg-gray-100 hover:bg-green-50 hover:border-green-400 p-3 rounded-lg border transition"
                >
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-green-600">{item.icon}</span> {item.nama}
                  </span>
                  <span className="text-gray-400 text-lg">›</span>
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Layanan Administrasi */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Layanan Administrasi
            </h3>
            <div className="space-y-3">
              {layananAdmin.map((layanan, i) => (
                <button
                  key={i}
                  onClick={() => navigate(layanan.path)}
                  className="w-full bg-gray-100 hover:bg-blue-50 hover:border-blue-400 p-3 rounded-lg border transition text-left font-medium text-gray-700"
                >
                  {layanan.nama}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Regulasi */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Regulasi & Peraturan Desa
        </h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3">Judul Peraturan</th>
                <th className="p-3">No. / Tahun</th>
                <th className="p-3 text-center">Unduh</th>
              </tr>
            </thead>
            <tbody>
              {regulasi.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{item.judul}</td>
                  <td className="p-3">{item.tahun}</td>
                  <td className="p-3 text-center">
                    <button className="text-blue-600 flex items-center gap-1 hover:underline mx-auto">
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
