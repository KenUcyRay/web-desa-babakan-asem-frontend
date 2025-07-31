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
import { Helper } from "../../../utils/Helper";

const iconList = [
  <FaHeartbeat />,
  <FaLeaf />,
  <FaHeartbeat />,
  <FaBook />,
  <FaUsers />,
  <FaWater />,
  <FaLightbulb />,
  <FaDollarSign />,
  <FaIndustry />,
  <FaBalanceScale />,
  <FaCity />,
  <FaRecycle />,
  <FaGlobeAmericas />,
  <FaWater />,
  <FaSeedling />,
  <FaHandshake />,
  <FaUniversity />,
];

export default function ManageSDGs() {
  const [sdg, setSdg] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [progressBaru, setProgressBaru] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSdg = async () => {
    const response = await InfografisApi.getSdg();
    const data = await response.json();

    if (!response.ok) {
      alertError("Gagal mengambil data SDGs.");
      return;
    }

    setSdg(data.sdgs);

    // Cek update terakhir
    const latestData = data.sdgs.reduce((latest, current) => {
      return new Date(current.updated_at || 0) >
        new Date(latest.updated_at || 0)
        ? current
        : latest;
    }, {});
    if (latestData.updated_at) setLastUpdated(latestData.updated_at);
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setProgressBaru(sdg[idx].progress);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (isNaN(progressBaru) || progressBaru === "") {
      alertError("Progress harus berupa angka.");
      return;
    }

    const updated = [...sdg];
    const id = updated[editingIndex].id;
    const body = { progress: parseInt(progressBaru) };

    const res = await InfografisApi.updateSdg(id, body);
    if (res.ok) {
      updated[editingIndex].progress = parseInt(progressBaru);
      updated[editingIndex].updated_at = new Date().toISOString();
      setSdg(updated);
      alertSuccess("Progress berhasil diperbarui.");
      setShowForm(false);
    } else {
      alertError("Gagal memperbarui progress.");
    }
  };

  useEffect(() => {
    fetchSdg();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Manajemen SDGs</h2>
          <p className="text-gray-600 mt-2">
            Edit dan kelola progress 17 Tujuan Pembangunan Berkelanjutan Desa.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Terakhir diperbarui: {Helper.formatTanggal(lastUpdated)}
            </p>
          )}
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* Grid SDGs */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sdg.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.03] transition-all relative"
          >
            <div className="text-3xl text-[#B6F500]">
              {iconList[idx] || <FaHeartbeat />}
            </div>
            <p className="text-gray-600 mt-2 text-center">{`${idx + 1}. ${
              item.name
            }`}</p>
            <p className="text-xl font-bold text-gray-800">{item.progress}%</p>
            {item.updated_at && (
              <p className="mt-1 text-xs text-gray-400">
                Diperbarui: {Helper.formatTanggal(item.updated_at)}
              </p>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${item.progress}%` }}
              />
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

      {/* Modal Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              Edit Progress - {sdg[editingIndex].name}
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress Baru (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={progressBaru}
              onChange={(e) => setProgressBaru(e.target.value)}
              className="w-full p-2 border rounded mb-4"
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
