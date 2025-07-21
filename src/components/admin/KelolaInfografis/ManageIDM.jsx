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
  // Data IDM, masing2 item ada tahun dan skor
  const [skorIDM, setSkorIDM] = useState([
    { tahun: "2021", skor: 0.68 },
    { tahun: "2022", skor: 0.72 },
    { tahun: "2023", skor: 0.75 },
    { tahun: "2024", skor: 0.8 },
  ]);

  // State modal form
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ tahun: "", skor: "" });

  // Buka modal tambah
  const handleAdd = () => {
    setFormData({ tahun: "", skor: "" });
    setIsAdding(true);
    setEditingIndex(null);
    setShowForm(true);
  };

  // Buka modal edit
  const handleEdit = (index) => {
    setFormData({
      tahun: skorIDM[index].tahun,
      skor: skorIDM[index].skor.toString(),
    });
    setEditingIndex(index);
    setIsAdding(false);
    setShowForm(true);
  };

  // Hapus data dengan konfirmasi
  const handleDelete = (index) => {
    if (confirm(`Hapus data tahun ${skorIDM[index].tahun} ?`)) {
      setSkorIDM((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Simpan data dari form (Tambah/Edit)
  const handleSave = () => {
    const tahunTrimmed = formData.tahun.trim();
    const skorNum = parseFloat(formData.skor);

    if (!tahunTrimmed) {
      alert("Tahun harus diisi!");
      return;
    }
    if (isNaN(skorNum) || skorNum < 0 || skorNum > 1) {
      alert("Skor harus angka antara 0 sampai 1!");
      return;
    }

    if (isAdding) {
      // Cek duplikat tahun
      if (skorIDM.some((d) => d.tahun === tahunTrimmed)) {
        alert("Data tahun ini sudah ada!");
        return;
      }
      setSkorIDM((prev) => [...prev, { tahun: tahunTrimmed, skor: skorNum }]);
    } else {
      // Update data edit
      const updated = [...skorIDM];
      updated[editingIndex] = { tahun: tahunTrimmed, skor: skorNum };
      setSkorIDM(updated);
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins md:ml-64 bg-gray-50 min-h-screen">
      {/* Judul dan tombol tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Skor IDM Desa Babakan Asem
          </h2>
          <p className="mt-2 text-gray-600">
            Indeks Desa Membangun (IDM) dari tahun ke tahun.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Tambah Data
        </button>
      </div>

      {/* Daftar data dengan tombol edit & hapus */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="p-3 text-left">Tahun</th>
              <th className="p-3 text-left">Skor</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {skorIDM.map((data, i) => (
              <tr
                key={data.tahun}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">{data.tahun}</td>
                <td className="p-3">{data.skor}</td>
                <td className="p-3 space-x-2">
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
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  Data kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Grafik Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Perkembangan Skor IDM
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skorIDM}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tahun" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="skor" stroke="#B6F500" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modal Form Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Data" : "Edit Data"}
            </h3>

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
              placeholder="Misal: 2025"
            />

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
