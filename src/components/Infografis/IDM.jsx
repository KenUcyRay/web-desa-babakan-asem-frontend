import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IDM() {
  const skorIDM = [
    { tahun: "2021", skor: 0.68 },
    { tahun: "2022", skor: 0.72 },
    { tahun: "2023", skor: 0.75 },
    { tahun: "2024", skor: 0.8 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Skor IDM Desa Babakan Asem
        </h2>
        <p className="mt-2 text-gray-600">
          Indeks Desa Membangun (IDM) dari tahun ke tahun.
        </p>
      </div>

      {/* ✅ Statistik Kotak */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Status Desa</p>
          <p className="text-xl font-bold text-gray-800">Maju</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Sosial</p>
          <p className="text-xl font-bold text-gray-800">0.78</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Ekonomi</p>
          <p className="text-xl font-bold text-gray-800">0.72</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Lingkungan</p>
          <p className="text-xl font-bold text-gray-800">0.74</p>
        </div>
      </div>

      {/* ✅ Tambah Diagram Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Perkembangan Skor IDM
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skorIDM}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tahun" />
            <YAxis domain={[0.6, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="skor"
              stroke="#B6F500"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
