import { useState } from "react";
import cuate from "../../../assets/cuate.png";
import {
  FaLeaf,
  FaWater,
  FaLightbulb,
  FaHeartbeat,
  FaBook,
  FaDollarSign,
  FaIndustry,
  FaCity,
  FaBalanceScale,
  FaGlobeAmericas,
  FaSolarPanel,
  FaHandshake,
  FaUniversity,
  FaRecycle,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";

const iconMap = {
  FaHeartbeat: <FaHeartbeat />,
  FaLeaf: <FaLeaf />,
  FaWater: <FaWater />,
  FaLightbulb: <FaLightbulb />,
  FaBook: <FaBook />,
  FaUsers: <FaUsers />,
  FaDollarSign: <FaDollarSign />,
  FaIndustry: <FaIndustry />,
  FaCity: <FaCity />,
  FaBalanceScale: <FaBalanceScale />,
  FaGlobeAmericas: <FaGlobeAmericas />,
  FaHandshake: <FaHandshake />,
  FaUniversity: <FaUniversity />,
  FaRecycle: <FaRecycle />,
  FaSeedling: <FaSeedling />,
};

const iconOptions = [
  { key: "FaHeartbeat", label: "FaHeartbeat", icon: <FaHeartbeat /> },
  { key: "FaLeaf", label: "FaLeaf", icon: <FaLeaf /> },
  { key: "FaWater", label: "FaWater", icon: <FaWater /> },
  { key: "FaLightbulb", label: "FaLightbulb", icon: <FaLightbulb /> },
  { key: "FaBook", label: "FaBook", icon: <FaBook /> },
  { key: "FaUsers", label: "FaUsers", icon: <FaUsers /> },
  { key: "FaDollarSign", label: "FaDollarSign", icon: <FaDollarSign /> },
  { key: "FaIndustry", label: "FaIndustry", icon: <FaIndustry /> },
  { key: "FaCity", label: "FaCity", icon: <FaCity /> },
  { key: "FaBalanceScale", label: "FaBalanceScale", icon: <FaBalanceScale /> },
  { key: "FaGlobeAmericas", label: "FaGlobeAmericas", icon: <FaGlobeAmericas /> },
  { key: "FaHandshake", label: "FaHandshake", icon: <FaHandshake /> },
  { key: "FaUniversity", label: "FaUniversity", icon: <FaUniversity /> },
  { key: "FaRecycle", label: "FaRecycle", icon: <FaRecycle /> },
  { key: "FaSeedling", label: "FaSeedling", icon: <FaSeedling /> },
];

export default function SDGs() {
  const [data, setData] = useState([
    { iconKey: "FaHeartbeat", label: "1. Tanpa Kemiskinan", value: "75%" },
    { iconKey: "FaLeaf", label: "2. Tanpa Kelaparan", value: "80%" },
    { iconKey: "FaHeartbeat", label: "3. Kesehatan & Kesejahteraan", value: "85%" },
    { iconKey: "FaBook", label: "4. Pendidikan Berkualitas", value: "90%" },
    { iconKey: "FaUsers", label: "5. Kesetaraan Gender", value: "70%" },
    { iconKey: "FaWater", label: "6. Air Bersih & Sanitasi", value: "92%" },
    { iconKey: "FaLightbulb", label: "7. Energi Bersih & Terjangkau", value: "65%" },
    { iconKey: "FaDollarSign", label: "8. Pekerjaan Layak & Ekonomi", value: "78%" },
    { iconKey: "FaIndustry", label: "9. Infrastruktur & Inovasi", value: "68%" },
    { iconKey: "FaBalanceScale", label: "10. Mengurangi Ketimpangan", value: "60%" },
    { iconKey: "FaCity", label: "11. Kota & Komunitas Berkelanjutan", value: "74%" },
    { iconKey: "FaRecycle", label: "12. Konsumsi Bertanggung Jawab", value: "81%" },
    { iconKey: "FaGlobeAmericas", label: "13. Aksi Iklim", value: "77%" },
    { iconKey: "FaWater", label: "14. Ekosistem Lautan", value: "69%" },
    { iconKey: "FaSeedling", label: "15. Ekosistem Daratan", value: "83%" },
    { iconKey: "FaHandshake", label: "16. Perdamaian & Keadilan", value: "88%" },
    { iconKey: "FaUniversity", label: "17. Kemitraan untuk Tujuan", value: "72%" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    iconKey: "FaHeartbeat",
    label: "",
    value: "",
  });

  const getIconByKey = (key) => {
    const found = iconOptions.find((opt) => opt.key === key);
    return found ? found.icon : <FaHeartbeat />;
  };

  const handleAdd = () => {
    setFormData({ iconKey: "FaHeartbeat", label: "", value: "" });
    setIsAdding(true);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setIsAdding(false);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (confirm(`Hapus tujuan SDGs: "${data[index].label}"?`)) {
      setData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!formData.label.trim()) {
      alert("Label harus diisi!");
      return;
    }
    if (!formData.value.trim() || !formData.value.endsWith("%")) {
      alert("Value harus diisi dan diakhiri dengan '%'");
      return;
    }

    if (isAdding) {
      setData((prev) => [...prev, formData]);
    } else {
      const updated = [...data];
      updated[editingIndex] = formData;
      setData(updated);
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins md:ml-64 bg-gray-50 min-h-screen">
      {/* Header + tombol tambah */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">SDGs Desa</h2>
          <p className="mt-2 text-gray-600">
            17 Tujuan Pembangunan Berkelanjutan di Desa Babakan Asem.
          </p>
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      <button
        onClick={handleAdd}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
      >
        Tambah Tujuan
      </button>

      {/* Grid data */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all relative"
          >
            <div className="text-3xl text-[#B6F500]">{getIconByKey(item.iconKey)}</div>
            <p className="text-gray-600 mt-2 text-center">{item.label}</p>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>

            {/* Edit & Hapus */}
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
        ))}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Tujuan SDGs" : "Edit Tujuan SDGs"}
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Icon</label>
            <select
              value={formData.iconKey}
              onChange={(e) =>
                setFormData({ ...formData, iconKey: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            >
              {iconOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: 1. Tanpa Kemiskinan"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Progress (contoh: 75%)</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              placeholder="Misal: 75%"
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
