import { useState } from "react";
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
  const [skorIDM, setSkorIDM] = useState([
    { tahun: "2021", skor: 0.68 },
    { tahun: "2022", skor: 0.72 },
    { tahun: "2023", skor: 0.75 },
    { tahun: "2024", skor: 0.8 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ tahun: "", skor: "" });

  const handleAdd = () => {
    setFormData({ tahun: "", skor: "" });
    setIsAdding(true);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setFormData({
      tahun: skorIDM[index].tahun,
      skor: skorIDM[index].skor.toString(),
    });
    setEditingIndex(index);
    setIsAdding(false);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (confirm(`Hapus data tahun ${skorIDM[index].tahun} ?`)) {
      setSkorIDM((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const tahunTrimmed = formData.tahun.trim();
    const skorNum = parseFloat(formData.skor);

    if (!tahunTrimmed) {
      alert("Tahun harus diisi!");
      return;
    }
    if (isNaN(skorNum) || skorNum < 0 || skorNum > 1) {
      alert("Skor harus angka antara 0 - 1!");
      return;
    }

    if (isAdding) {
      if (skorIDM.some((d) => d.tahun === tahunTrimmed)) {
        alert("Data tahun ini sudah ada!");
        return;
      }
      setSkorIDM((prev) => [...prev, { tahun: tahunTrimmed, skor: skorNum }]);
    } else {
      const updated = [...skorIDM];
      updated[editingIndex] = { tahun: tahunTrimmed, skor: skorNum };
      setSkorIDM(updated);
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Skor IDM Desa Babakan Asem
          </h2>
          <p className="mt-2 text-gray-600">
            Perkembangan <strong>Indeks Desa Membangun (IDM)</strong> dari tahun ke tahun.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          + Tambah Data
        </button>
      </div>

      {/* ✅ Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Tahun</th>
              <th className="p-3 text-left font-semibold text-gray-700">Skor</th>
              <th className="p-3 text-left font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {skorIDM.map((data, i) => (
              <tr
                key={data.tahun}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-3">{data.tahun}</td>
                <td className="p-3">{data.skor}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => handleEdit(i)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {skorIDM.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Belum ada data IDM.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Grafik Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Grafik Perkembangan Skor IDM
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skorIDM}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tahun" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="skor"
              stroke="#B6F500"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Data IDM" : "Edit Data IDM"}
            </h3>

            {/* Tahun */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <input
              type="text"
              value={formData.tahun}
              onChange={(e) =>
                setFormData({ ...formData, tahun: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Contoh: 2025"
            />

            {/* Skor */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skor (0 - 1)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.skor}
              onChange={(e) =>
                setFormData({ ...formData, skor: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: 0.85"
            />

            {/* Tombol */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
