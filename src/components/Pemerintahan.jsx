import React from "react";
import { FaFlag, FaUsers, FaHome, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";

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

  return (
    <div className="bg-gray-50 py-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ✅ Tombol Back */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold 
          bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow hover:shadow-lg hover:scale-105 transition"
        >
          <HiHome className="text-lg" /> Kembali ke Beranda
        </button>

        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Pemerintah Desa
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Pemerintah Desa Babakan Asem berkomitmen pada transparansi &
          partisipasi masyarakat demi kesejahteraan bersama.
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
          {/* Lembaga */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Lembaga Desa</h3>
            {["BPD", "LMDP", "RT/RW"].map((nama, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between bg-gray-100 p-3 rounded hover:bg-gray-200 mb-2"
              >
                <span className="flex items-center gap-2">
                  {i === 0 ? <FaFlag /> : i === 1 ? <FaUsers /> : <FaHome />}
                  {nama}
                </span>
                <span>{">"}</span>
              </button>
            ))}
          </div>

          {/* Layanan */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Layanan Administrasi</h3>
            {["Surat Pengantar", "Formulir Layanan", "Layanan Online"].map(
              (layanan, i) => (
                <button
                  key={i}
                  className="w-full bg-gray-100 p-3 rounded hover:bg-gray-200 mb-2"
                >
                  {layanan}
                </button>
              )
            )}
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
