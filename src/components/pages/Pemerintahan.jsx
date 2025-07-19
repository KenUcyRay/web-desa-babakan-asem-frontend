import React from "react";
import { FaFlag, FaUsers, FaHome, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Pemerintahan() {
  const navigate = useNavigate();

  const struktur = [
    { nama: "H. Daryanto Sasmita", jabatan: "Kepala Desa", periode: "2020 - 2026" },
    { nama: "Siti Aminah", jabatan: "Sekretaris Desa", periode: "2020 - 2026" },
    { nama: "Rudi Hartono", jabatan: "Kaur Keuangan", periode: "2020 - 2026" },
    { nama: "Dewi Lestari", jabatan: "Kaur Perencanaan", periode: "2020 - 2026" },
  ];

  const regulasi = [
    { judul: "Perdes Tentang Desa", tahun: "01/2021" },
    { judul: "Perdes Rencana Pembangunan", tahun: "02/2023" },
  ];

  // ✅ Lembaga Desa dengan path
  const lembagaDesa = [
    { nama: "BUMDes", icon: <FaFlag />, path: "/bumdes" },
    { nama: "Dpd", icon: <FaUsers />, path: "/dpd" },
    { nama: "Karang Taruna", icon: <FaHome />, path: "/karang-taruna" }
  ];

  // ✅ Layanan Administrasi dengan path
  const layananAdmin = [
    { nama: "Surat Pengantar", path: "/surat-pengantar" },
    { nama: "Formulir Layanan", path: "/formulir-layanan" },
    { nama: "Layanan Online", path: "/layanan-online" }
  ];

  return (
    <div className="bg-gray-50 py-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Pemerintah Desa
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Pemerintah Desa Babakan Asem berkomitmen pada transparansi & partisipasi masyarakat demi kesejahteraan bersama.
        </p>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-xl shadow p-6 mb-12">
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] text-center">
            {struktur.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center hover:scale-105 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt={item.nama}
                  className="w-20 h-20 rounded-full border mb-3"
                />
                <h3 className="font-semibold text-gray-800">{item.nama}</h3>
                <p className="text-sm text-gray-500">{item.jabatan}</p>
                <p className="text-xs text-gray-400">{item.periode}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lembaga Kemasyarakatan & Layanan Administrasi */}
        <h2 className="text-xl font-semibold text-center mb-6">
          Lembaga Kemasyarakatan & Layanan Administrasi
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* ✅ Lembaga Desa */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Lembaga Desa</h3>
            {lembagaDesa.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between bg-gray-100 p-3 rounded hover:bg-gray-200 mb-2"
              >
                <span className="flex items-center gap-2">
                  {item.icon} {item.nama}
                </span>
                <span>{">"}</span>
              </button>
            ))}
          </div>

          {/* ✅ Layanan Administrasi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Layanan Administrasi</h3>
            {layananAdmin.map((layanan, i) => (
              <button
                key={i}
                onClick={() => navigate(layanan.path)}
                className="w-full bg-gray-100 p-3 rounded hover:bg-gray-200 mb-2 text-left"
              >
                {layanan.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Regulasi */}
        <h2 className="text-xl font-semibold text-center mb-4">
          Regulasi & Peraturan Desa
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Judul Peraturan</th>
                <th className="p-3">No. / Tahun</th>
                <th className="p-3 text-center">Unduh</th>
              </tr>
            </thead>
            <tbody>
              {regulasi.map((item, index) => (
                <tr key={index} className="border-b">
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
