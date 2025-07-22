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
  const [editingIndex, setEditingIndex] = useState(null);
  const [progressBaru, setProgressBaru] = useState("");

  const getIconByKey = (key) => iconMap[key] || <FaHeartbeat />;

  const handleEdit = (index) => {
    setEditingIndex(index);
    setProgressBaru(data[index].value.replace("%", ""));
    setShowForm(true);
  };

  const handleSave = () => {
    if (!progressBaru.trim() || isNaN(progressBaru)) {
      alert("Masukkan angka progress yang valid!");
      return;
    }
    const updated = [...data];
    updated[editingIndex].value = `${progressBaru}%`;
    setData(updated);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">SDGs Desa</h2>
          <p className="text-gray-600 mt-2">
            17 Tujuan Pembangunan Berkelanjutan di Desa Babakan Asem.<br />
            Anda hanya bisa memperbarui progress (%) tiap tujuan.
          </p>
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* ✅ Grid data */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all relative"
          >
            {/* Icon */}
            <div className="text-3xl text-[#B6F500]">{getIconByKey(item.iconKey)}</div>

            {/* Label */}
            <p className="text-gray-600 mt-2 text-center">{item.label}</p>

            {/* Progress */}
            <p className="text-xl font-bold text-gray-800">{item.value}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: item.value }}
              ></div>
            </div>

            {/* Tombol Edit */}
            <button
              onClick={() => handleEdit(idx)}
              className="absolute top-3 right-3 text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Modal Edit Progress */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              Edit Progress - {data[editingIndex].label}
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress (%) Baru
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={progressBaru}
              onChange={(e) => setProgressBaru(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="contoh: 75"
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
