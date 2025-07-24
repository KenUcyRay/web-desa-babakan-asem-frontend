import { useEffect, useState } from "react";
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
  FaHandshake,
  FaUniversity,
  FaRecycle,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";
import { InfografisApi } from "../../../libs/api/InfografisApi";
import { alertError, alertSuccess } from "../../../libs/alert";

const iconMap = {
  "Tanpa Kemiskinan": <FaHeartbeat />,
  "Tanpa Kelaparan": <FaLeaf />,
  "Kesehatan & Kesejahteraan": <FaHeartbeat />,
  "Pendidikan Berkualitas": <FaBook />,
  "Kesetaraan Gender": <FaUsers />,
  "Air Bersih & Sanitasi": <FaWater />,
  "Energi Bersih & Terjangkau": <FaLightbulb />,
  "Pekerjaan Layak & Ekonomi": <FaDollarSign />,
  "Infrastruktur & Inovasi": <FaIndustry />,
  "Mengurangi Ketimpangan": <FaBalanceScale />,
  "Kota & Komunitas Berkelanjutan": <FaCity />,
  "Konsumsi Bertanggung Jawab": <FaRecycle />,
  "Aksi Iklim": <FaGlobeAmericas />,
  "Ekosistem Lautan": <FaWater />,
  "Ekosistem Daratan": <FaSeedling />,
  "Perdamaian & Keadilan": <FaHandshake />,
  "Kemitraan untuk Tujuan": <FaUniversity />,
};

export default function SDGs() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [progressBaru, setProgressBaru] = useState("");

  const getIconByLabel = (label) => {
    const cleanLabel = label.replace(/^\d+\.\s*/, "").trim();
    return iconMap[cleanLabel] || <FaHeartbeat />;
  };

  const fetchData = async () => {
    const res = await InfografisApi.getSdg();
    const json = await res.json();
    if (res.ok) {
      const mapped = json.sdgs.map((item, idx) => ({
        id: item.id,
        label: `${idx + 1}. ${item.name}`,
        value: `${item.progress}%`,
      }));
      setData(mapped);
    } else {
      alertError("Gagal mengambil data SDGs");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setProgressBaru(data[index].value.replace("%", ""));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!progressBaru.trim() || isNaN(progressBaru)) {
      alert("Masukkan angka progress yang valid!");
      return;
    }

    const id = data[editingIndex].id;
    const body = { progress: parseInt(progressBaru) };

    const res = await InfografisApi.updateSdg(id, body);

    if (res.ok) {
      const updated = [...data];
      updated[editingIndex].value = `${progressBaru}%`;
      setData(updated);
      setShowForm(false);
      alertSuccess("Progress berhasil diperbarui");
    } else {
      alertError("Gagal memperbarui data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* - Header */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">SDGs Desa</h2>
          <p className="text-gray-600 mt-2">
            17 Tujuan Pembangunan Berkelanjutan di Desa Babakan Asem.
            <br />
            Anda hanya bisa memperbarui progress (%) tiap tujuan.
          </p>
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* - Grid data */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all relative"
          >
            <div className="text-3xl text-[#B6F500]">
              {getIconByLabel(item.label)}
            </div>
            <p className="text-gray-600 mt-2 text-center">{item.label}</p>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: item.value }}
              ></div>
            </div>
            <button
              onClick={() => handleEdit(idx)}
              className="absolute top-3 right-3 text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* - Modal Edit Progress */}
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
