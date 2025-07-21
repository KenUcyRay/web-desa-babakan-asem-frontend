import { useState } from "react";
import pana from "../../../assets/pana.png";
import { FaMale, FaFemale, FaChild, FaHome, FaEdit } from "react-icons/fa";
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
  const [jumlahBaru, setJumlahBaru] = useState("");

  const chartData = data.map((item) => ({
    name: item.label,
    jumlah: item.value,
  }));

  const handleEdit = (index) => {
    setEditingIndex(index);
    setJumlahBaru(data[index].value);
    setShowForm(true);
  };

  const handleSave = () => {
    const updatedData = [...data];
    updatedData[editingIndex].value = parseInt(jumlahBaru);
    setData(updatedData);
    setShowForm(false);
  };

  return (
    <div className="p-6 font-poppins md:ml-64">
      {/* ✅ Judul */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Kelola Infografis Penduduk</h2>
        <p className="text-gray-500 text-sm">
          Anda hanya bisa mengedit jumlah penduduk untuk tiap kategori.
        </p>
      </div>

      {/* ✅ Preview Info */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 leading-snug">
            Demografi Penduduk Desa Babakan
          </h3>
          <p className="mt-2 text-gray-600 text-justify">
            Data ini bersifat ilustratif. Anda bisa memperbarui jumlah kategori
            penduduk sesuai kondisi terkini.
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

            {/* Tombol Edit */}
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleEdit(idx)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
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

      {/* ✅ Modal Edit Jumlah */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              Edit Jumlah - {data[editingIndex].label}
            </h3>

            {/* Jumlah */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Penduduk
            </label>
            <input
              type="number"
              value={jumlahBaru}
              onChange={(e) => setJumlahBaru(e.target.value)}
              className="w-full p-2 border rounded mb-4"
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
