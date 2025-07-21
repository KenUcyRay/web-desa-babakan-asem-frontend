import { useState } from "react";
import pana from "../../../assets/pana.png";
import { FaMale, FaFemale, FaChild, FaHome, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ManagePenduduk() {
  const iconOptions = [
    { key: "male", label: "Laki-laki", icon: <FaMale /> },
    { key: "female", label: "Perempuan", icon: <FaFemale /> },
    { key: "home", label: "Kepala Keluarga", icon: <FaHome /> },
    { key: "child", label: "Anak-anak", icon: <FaChild /> },
  ];

  const getIconByKey = (key) => {
    const found = iconOptions.find((opt) => opt.key === key);
    return found ? found.icon : <FaHome />;
  };

  const [data, setData] = useState([
    { iconKey: "male", label: "Laki-laki", value: 320 },
    { iconKey: "female", label: "Perempuan", value: 340 },
    { iconKey: "home", label: "Kepala Keluarga", value: 120 },
    { iconKey: "child", label: "Anak-anak", value: 210 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ label: "", value: "", iconKey: "home" });

  const chartData = data.map((item) => ({
    name: item.label,
    jumlah: item.value,
  }));

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData({
      label: data[index].label,
      value: data[index].value,
      iconKey: data[index].iconKey,
    });
    setIsAdding(false);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ label: "", value: "", iconKey: "home" });
    setEditingIndex(null);
    setIsAdding(true);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (confirm("Yakin mau hapus data ini?")) {
      setData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!formData.label.trim() || !formData.value) {
      alert("Isi semua field!");
      return;
    }

    if (isAdding) {
      setData((prev) => [
        ...prev,
        {
          iconKey: formData.iconKey,
          label: formData.label,
          value: parseInt(formData.value),
        },
      ]);
    } else {
      const updatedData = [...data];
      updatedData[editingIndex] = {
        iconKey: formData.iconKey,
        label: formData.label,
        value: parseInt(formData.value),
      };
      setData(updatedData);
    }

    setShowForm(false);
  };

  return (
    <div className="p-6 font-poppins md:ml-64">
      {/* ✅ Judul + Tombol Tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Kelola Infografis Penduduk</h2>
          <p className="text-gray-500 text-sm">
            Edit atau tambahkan kategori penduduk desa.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          <FaPlus /> Tambah Data
        </button>
      </div>

      {/* ✅ Preview Info */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 leading-snug">
            Demografi Penduduk Desa Babakan
          </h3>
          <p className="mt-2 text-gray-600 text-justify">
            Data ini bersifat ilustratif. Anda bisa menambah, mengedit, atau menghapus
            kategori penduduk sesuai kebutuhan.
          </p>
        </div>
        <img
          src={pana}
          alt="Ilustrasi Penduduk"
          className="w-full max-w-md mx-auto drop-shadow-md"
        />
      </div>

      {/* ✅ Grid Statistik */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            {/* Icon */}
            <div className="text-4xl text-[#B6F500]">
              {getIconByKey(item.iconKey)}
            </div>

            {/* Nama kategori & angka */}
            <p className="text-gray-600 mt-2 text-sm">{item.label}</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>

            {/* Tombol Edit & Hapus */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(idx)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Grafik */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Grafik Distribusi Penduduk
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#B6F500" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Modal Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Data" : "Edit Data"}
            </h3>

            {/* Nama Kategori */}
            <label className="block text-sm font-medium text-gray-700">
              Nama Kategori
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Jumlah */}
            <label className="block text-sm font-medium text-gray-700">
              Jumlah
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Pilih Icon */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Icon
            </label>
            <select
              value={formData.iconKey}
              onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            >
              {iconOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Preview Icon */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-600 text-sm">Preview:</span>
              <div className="text-2xl text-green-500">
                {getIconByKey(formData.iconKey)}
              </div>
            </div>

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
