import { useEffect, useState } from "react";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert"; // ← pastikan ada
import { InfografisApi } from "../../../libs/api/InfografisApi";

export default function Bansos() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ nama: "", penerima: "" });

  const handleAdd = () => {
    setFormData({ nama: "", penerima: "" });
    setIsAdding(true);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    const item = data[index];
    setFormData({
      id: item.id, // ← tambahkan ini
      nama: item.nama,
      penerima: item.penerima.toString(),
    });
    setIsAdding(false);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const confirm = await alertConfirm(
      `Yakin ingin menghapus "${data[index].nama}"?`
    );
    if (!confirm) return;

    const id = data[index].id;
    const response = await InfografisApi.deleteBansos(id);

    if (!response.ok) {
      alertError("Gagal menghapus data.");
      return;
    }

    setData((prev) => prev.filter((_, i) => i !== index));
    alertSuccess("Data berhasil dihapus!");
  };

  const handleSave = async () => {
    if (!formData.nama.trim()) {
      alertError("Nama bantuan harus diisi!");
      return;
    }
    const penerimaNum = parseInt(formData.penerima);
    if (isNaN(penerimaNum) || penerimaNum < 0) {
      alertError("Jumlah penerima harus angka positif!");
      return;
    }

    const payload = {
      name: formData.nama.trim(),
      amount: penerimaNum,
    };

    if (isAdding) {
      const response = await InfografisApi.createBansos(payload);
      if (!response.ok) {
        alertError("Gagal menyimpan data ke server.");
        return;
      }

      const result = await response.json();
      const newItem = {
        id: result.bansos.id,
        nama: result.bansos.name,
        penerima: result.bansos.amount,
      };
      setData((prev) => [newItem, ...prev]);
      alertSuccess("Data berhasil ditambahkan!");
    } else {
      const response = await InfografisApi.updateBansos(formData.id, payload);
      if (!response.ok) {
        alertError("Gagal mengupdate data.");
        return;
      }

      const updated = [...data];
      updated[editingIndex] = {
        id: formData.id, // pastikan tetap simpan id-nya
        nama: formData.nama.trim(),
        penerima: penerimaNum,
      };
      setData(updated);
      alertSuccess("Data berhasil diperbarui!");
    }

    setShowForm(false);
  };

  const fetchData = async () => {
    const response = await InfografisApi.getBansos();

    if (!response.ok) {
      alertError("Gagal mengambil data bansos");
      return;
    }

    const result = await response.json();

    const mapped = result.bansos.map((item) => ({
      id: item.id,
      nama: item.name,
      penerima: item.amount,
    }));

    setData(mapped);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* - Header + tombol tambah */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Data Bantuan Sosial
          </h2>
          <p className="mt-2 text-gray-600">
            Daftar bantuan sosial yang diterima warga Desa Babakan Asem.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          + Tambah Data
        </button>
      </div>

      {/* - Grid data bansos */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
        {data.length > 0 ? (
          data.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition relative"
            >
              {/* Nama bantuan */}
              <p className="font-semibold text-gray-800">{item.nama}</p>
              <p className="text-gray-500 text-sm">Jumlah Penerima</p>

              {/* Jumlah */}
              <span className="block mt-2 text-2xl font-bold text-[#B6F500]">
                {item.penerima}
              </span>

              {/* Tombol Edit & Hapus */}
              <div className="absolute top-3 right-3 flex gap-3 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(idx)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 mt-4">
            Belum ada data bantuan sosial.
          </p>
        )}
      </div>

      {/* - Modal form tambah/edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Bantuan" : "Edit Bantuan"}
            </h3>

            {/* Nama Bantuan */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Bantuan
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: BLT Dana Desa"
            />

            {/* Jumlah Penerima */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Penerima
            </label>
            <input
              type="number"
              min="0"
              value={formData.penerima}
              onChange={(e) =>
                setFormData({ ...formData, penerima: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: 100"
            />

            {/* Tombol Modal */}
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
