import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { FaEdit } from "react-icons/fa";

const dummyData = [
  { id: 1, key: "Makan Gratis", anggaran: 200, realisasi: 100 },
  { id: 2, key: "Pendidikan", anggaran: 150, realisasi: 50 },
  { id: 3, key: "Kesehatan", anggaran: 180, realisasi: 120 },
  { id: 4, key: "Infrastruktur", anggaran: 100, realisasi: 80 },
];

export default function ManageApb() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ anggaran: "", realisasi: "" });

  useEffect(() => {
    setData(dummyData);
  }, []);

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ anggaran: item.anggaran, realisasi: item.realisasi });
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              anggaran: parseInt(form.anggaran),
              realisasi: parseInt(form.realisasi),
            }
          : item
      )
    );
    setEditing(null);
  };

  const totalAnggaran = data.reduce((sum, item) => sum + item.anggaran, 0);
  const totalRealisasi = data.reduce((sum, item) => sum + item.realisasi, 0);
  const sisaAnggaran = totalAnggaran - totalRealisasi;
  const persen = totalAnggaran
    ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4">
        <span className="text-3xl">📊</span> APBDes 2025
      </h2>

      <h3 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Grafik Perbandingan Anggaran vs Realisasi
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="key" padding={{ left: 30, right: 30 }} />
          <YAxis unit=" jt" />
          <Tooltip />
          <Legend />
          <Bar dataKey="anggaran" name="Anggaran" fill="#4ade80" barSize={40} />
          <Line
            type="monotone"
            dataKey="realisasi"
            name="Realisasi"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Tombol edit per item */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md shadow-sm"
          >
            <div>
              <p className="font-semibold">{item.key}</p>
              <p className="text-sm text-gray-600">
                Anggaran: {item.anggaran} jt | Realisasi: {item.realisasi} jt
              </p>
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Ringkasan */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Anggaran" value={`${totalAnggaran} juta`} color="green" />
        <StatCard label="Total Realisasi" value={`${totalRealisasi} juta`} color="blue" />
        <StatCard label="Sisa Anggaran" value={`${sisaAnggaran} juta`} color="yellow" />
        <StatCard label="Penyerapan" value={`${persen}%`} color="purple" />
      </div>

      {/* Form Edit */}
      {editing && (
        <div className="mt-6 bg-white p-4 shadow rounded-lg">
          <h4 className="font-bold mb-4">Edit: {editing.key}</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="block mb-1">Anggaran (juta)</span>
              <input
                type="number"
                value={form.anggaran}
                onChange={(e) => setForm({ ...form, anggaran: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">Realisasi (juta)</span>
              <input
                type="number"
                value={form.realisasi}
                onChange={(e) => setForm({ ...form, realisasi: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <div className={`${colorMap[color]} p-4 rounded-xl`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
