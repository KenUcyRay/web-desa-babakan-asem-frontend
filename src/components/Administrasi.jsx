// components/Administrasi.jsx

import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaWpforms, FaUsers, FaGlobe } from "react-icons/fa";

const services = [
  {
    title: "Surat Pengantar",
    desc: "Untuk KTP, KK, SKCK, DLL",
    button: "Lihat Detail",
    icon: <HiOutlineMail className="text-6xl mb-4" />,
  },
  {
    title: "Formulir Layanan",
    desc: "Isi Formulir Pengajuan",
    button: "Isi Formulir",
    icon: <FaWpforms className="text-6xl mb-4" />,
  },
  {
    title: "Informasi Kependudukan",
    desc: "Detail Penduduk",
    button: "Lihat Data",
    icon: <FaUsers className="text-6xl mb-4" />,
  },
  {
    title: "Layanan Online",
    desc: "Ajukan & lacak Online",
    button: "Masuk Portal",
    icon: <FaGlobe className="text-6xl mb-4" />,
  },
];

export default function Administrasi() {
  const navigate = useNavigate(); // ← untuk pindah halaman

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tombol atas */}
        <div className="flex gap-4 mb-8">
          <button className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full">
            Ajukan Sekarang
          </button>
          <button
            onClick={() => navigate("/panduan")}
            className="bg-white text-black font-semibold px-6 py-2 rounded-full border hover:bg-gray-100"
          >
            Panduan Layanan
          </button>
        </div>

        {/* Kartu layanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              {service.icon}
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-gray-700 text-sm mt-1 mb-4">{service.desc}</p>
              <button className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-xl">
                {service.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
