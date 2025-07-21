import { useState } from "react";

export default function Bansos() {
  // State data bansos, awalnya dari array contoh kamu
  const [data, setData] = useState([
    { nama: "BLT Dana Desa", penerima: 50 },
    { nama: "Bantuan Pangan", penerima: 70 },
    { nama: "PKH", penerima: 40 },
    { nama: "Rastra", penerima: 30 },
  ]);

  // State modal form dan edit/adding flag
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form data
  const [formData, setFormData] = useState({ nama: "", penerima: "" });

  // Buka modal tambah
  const handleAdd = () => {
    setFormData({ nama: "", penerima: "" });
    setIsAdding(true);
    setEditingIndex(null);
    setShowForm(true);
  };

  // Buka modal edit dengan data terisi
  const handleEdit = (index) => {
    setFormData({
      nama: data[index].nama,
      penerima: data[index].penerima.toString(),
    });
    setIsAdding(false);
    setEditingIndex(index);
    setShowForm(true);
  };

  // Hapus data dengan konfirmasi
  const handleDelete = (index) => {
    if (confirm(`Hapus data bantuan sosial "${data[index].nama}"?`)) {
      setData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Simpan data tambah/edit
  const handleSave = () => {
    if (!formData.nama.trim()) {
      alert("Nama bantuan harus diisi!");
      return;
    }
    const penerimaNum = parseInt(formData.penerima);
    if (isNaN(penerimaNum) || penerimaNum < 0) {
      alert("Jumlah penerima harus angka positif!");
      return;
    }

    if (isAdding) {
      setData((prev) => [...prev, { nama: formData.nama.trim(), penerima: penerimaNum }]);
    } else {
      const updated = [...data];
      updated[editingIndex] = { nama: formData.nama.trim(), penerima: penerimaNum };
      setData(updated);
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins md:ml-64 bg-gray-50 min-h-screen">
      {/* Header + tombol tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Data Bantuan Sosial</h2>
          <p className="mt-2 text-gray-600">
            Daftar bantuan sosial yang diterima warga desa.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Tambah Data
        </button>
      </div>

      {/* Grid data bansos */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
        {data.length > 0 ? (
          data.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-center hover:shadow-md hover:-translate-y-1 transition relative"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.nama}</p>
                <p className="text-gray-500 text-sm">Jumlah Penerima</p>
              </div>
              <span className="text-xl font-bold text-[#B6F500]">{item.penerima}</span>

              {/* Tombol Edit & Hapus */}
              <div className="absolute top-3 right-3 flex gap-3 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(idx)}
                  className="text-blue-600 hover:underline text-sm"
                  aria-label="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-600 hover:underline text-sm"
                  aria-label="Hapus"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 mt-4">Data kosong</p>
        )}
      </div>

      {/* Modal form tambah/edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">{isAdding ? "Tambah Data" : "Edit Data"}</h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bantuan</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: BLT Dana Desa"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penerima</label>
            <input
              type="number"
              min="0"
              value={formData.penerima}
              onChange={(e) => setFormData({ ...formData, penerima: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: 100"
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
