import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";

export default function Panduan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-100 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Tombol kembali ke Ajukan Sekarang */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => navigate("/administrasi")}
            className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-lime-300 flex items-center gap-2"
          >
            <FaCheckCircle />
            Ajukan Sekarang
          </button>
        </div>

        {/* Judul & Isi Panduan */}
        <h1 className="text-4xl font-extrabold text-center mb-8 text-lime-700 drop-shadow-md">
          Panduan Layanan Administrasi Desa
        </h1>

        <p className="text-gray-700 text-center mb-12 text-lg max-w-xl mx-auto">
          Berikut adalah langkah-langkah umum untuk mengurus berbagai surat dan
          dokumen di Desa Babakan Asem dengan mudah dan cepat.
        </p>

        {/* Langkah Umum */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-lime-600 mb-5 flex items-center gap-3">
            <FaFileAlt className="text-lime-500" /> Langkah Umum Pengajuan
            Layanan
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-800 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-lime-500 mt-1">📄</span> Siapkan dokumen
              persyaratan sesuai jenis layanan.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-500 mt-1">🏢</span> Datang ke kantor
              desa atau gunakan layanan online.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-500 mt-1">📝</span> Serahkan berkas dan
              isi formulir sesuai permintaan.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-500 mt-1">🔍</span> Tunggu proses
              verifikasi oleh petugas desa.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-500 mt-1">🎉</span> Ambil dokumen atau
              surat pengantar yang sudah selesai.
            </li>
          </ol>
        </div>

        {/* Jenis Layanan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-lime-600 mb-5 flex items-center gap-3">
            <FaFileAlt className="text-lime-500" /> Jenis Layanan Tersedia
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 text-lg max-w-md mx-auto">
            <li>Surat Pengantar KTP/KK</li>
            <li>Surat Pengantar SKCK</li>
            <li>Surat Domisili & SKU</li>
            <li>Surat Keterangan Tidak Mampu</li>
            <li>Permohonan Usaha Kecil (UMKM)</li>
            <li>Permintaan Data Kependudukan</li>
          </ul>
        </div>

        {/* Catatan penting */}
        <div className="p-5 border-l-8 border-yellow-400 bg-yellow-50 text-yellow-900 text-lg rounded-lg flex items-center gap-4 shadow-md animate-pulse">
          <FaClock className="w-8 h-8" />
          <p>
            <strong>Catatan:</strong> Pelayanan hanya dilakukan pada hari kerja
            (Senin - Jumat) pukul 08.00 - 15.00 WIB. Harap membawa dokumen asli
            dan fotokopi.
          </p>
        </div>
      </div>
    </div>
  );
}
