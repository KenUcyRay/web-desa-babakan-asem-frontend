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
} from "recharts"; // ✅ Tambah Recharts

export default function Penduduk() {
  const data = [
    { icon: <FaMale />, label: "Laki-laki", value: 320 },
    { icon: <FaFemale />, label: "Perempuan", value: 340 },
    { icon: <FaHome />, label: "Keluarga", value: 120 },
    { icon: <FaChild />, label: "Anak-anak", value: 210 },
  ];

  // ✅ Data untuk chart (ambil dari data atas)
  const chartData = data.map((item) => ({
    name: item.label,
    jumlah: item.value,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul + Gambar */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Demografi Penduduk
          </h2>
          <p className="mt-2 text-gray-600">
            Gambaran jumlah penduduk berdasarkan kategori.
          </p>
        </div>
        <img src={pana} alt="Penduduk" className="w-full max-w-md mx-auto" />
      </div>

      {/* Grid Statistik */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow"
          >
            <div className="text-3xl text-[#B6F500]">{item.icon}</div>
            <p className="text-gray-600 mt-2">{item.label}</p>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Tambah Statistik Diagram */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Grafik Demografi Penduduk
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#B6F500" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
