import pana from "../../assets/pana.png";
import { FaMale, FaFemale, FaChild, FaHome } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Penduduk() {
  const data = [
    { icon: <FaMale />, label: "Laki-laki", value: 320 },
    { icon: <FaFemale />, label: "Perempuan", value: 340 },
    { icon: <FaHome />, label: "Kepala Keluarga", value: 120 },
    { icon: <FaChild />, label: "Anak-anak", value: 210 },
  ];

  const chartData = data.map((item) => ({
    name: item.label,
    jumlah: item.value,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-poppins">
      {/* Judul + Gambar */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 leading-snug">
            Demografi Penduduk Desa Babakan
          </h2>
          <p className="mt-4 text-gray-600 text-justify">
            Berikut adalah gambaran umum tentang jumlah penduduk Desa Babakan
            yang terbagi berdasarkan jenis kelamin, jumlah kepala keluarga, dan
            anak-anak. Data ini digunakan untuk keperluan perencanaan pembangunan,
            layanan masyarakat, dan pengelolaan desa secara lebih baik.
          </p>
          <p className="mt-2 text-gray-500 italic text-sm">
            *Data bersifat ilustratif untuk keperluan tampilan.
          </p>
        </div>
        <img src={pana} alt="Ilustrasi Penduduk" className="w-full max-w-md mx-auto drop-shadow-md" />
      </div>

      {/* Grid Statistik */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="text-4xl text-[#B6F500]">{item.icon}</div>
            <p className="text-gray-600 mt-2 text-sm">{item.label}</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="mt-14">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Grafik Distribusi Penduduk
        </h3>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Grafik ini menunjukkan jumlah penduduk desa dalam beberapa kategori utama.
          Dari grafik ini kita bisa melihat perbandingan jumlah laki-laki, perempuan,
          kepala keluarga, serta anak-anak.
        </p>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* Bar lebih ramping */}
            <Bar dataKey="jumlah" fill="#B6F500" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
