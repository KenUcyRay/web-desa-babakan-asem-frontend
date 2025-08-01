import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";
import { InfografisApi } from "../../../libs/api/InfografisApi";

export default function ManageIDM() {
  // - Data grafik IDM
  const [skorIDM, setSkorIDM] = useState([]);
  const [extraIdmId, setExtraIdmId] = useState(null);

  // - Data utama yang ditampilkan
  const [statusDesa, setStatusDesa] = useState("Maju");
  const [dimensiSosial, setDimensiSosial] = useState(0.78);
  const [dimensiEkonomi, setDimensiEkonomi] = useState(0.72);
  const [dimensiLingkungan, setDimensiLingkungan] = useState(0.74);

  // - Data sementara (belum disimpan)
  const [tempStatus, setTempStatus] = useState(statusDesa);
  const [tempSosial, setTempSosial] = useState(dimensiSosial);
  const [tempEkonomi, setTempEkonomi] = useState(dimensiEkonomi);
  const [tempLingkungan, setTempLingkungan] = useState(dimensiLingkungan);

  // - Simpan perubahan kotak statistik
  const handleSaveStatistik = async () => {
    if (!extraIdmId) return alertError("ID data statistik tidak ditemukan.");

    const response = await InfografisApi.updateExtraIdm(extraIdmId, {
      status_desa: tempStatus.toUpperCase(),
      sosial: tempSosial,
      ekonomi: tempEkonomi,
      lingkungan: tempLingkungan,
    });

    const resBody = await response.json();

    if (!response.ok) {
      return alertError(resBody?.error ?? "Gagal menyimpan data statistik.");
    }

    // Simpan ke state utama
    setStatusDesa(resBody.extraIdm.status_desa);
    setDimensiSosial(resBody.extraIdm.sosial);
    setDimensiEkonomi(resBody.extraIdm.ekonomi);
    setDimensiLingkungan(resBody.extraIdm.lingkungan);

    alertSuccess("Data statistik berhasil diperbarui.");
  };

  // - Modal tambah/edit skor IDM
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
  const handleEdit = (id) => {
    const item = skorIDM.find((d) => d.id === id);
    if (!item) return;

    setFormData({
      tahun: item.tahun,
      skor: item.skor.toString(),
    });
    setEditingIndex(id);
    setIsAdding(false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin ingin menghapus data ini?"))) return;

    const response = await InfografisApi.deleteIdm(id);

    if (!response.ok) {
      return alertError("Gagal menghapus data dari server.");
    }

    setSkorIDM((prev) => prev.filter((d) => d.id !== id));
    alertSuccess("Data berhasil dihapus.");
  };

  const handleSave = async () => {
    const tahunTrimmed = formData.tahun.trim();
    const skorTrimmed = formData.skor.trim();
    const skorNum = parseFloat(skorTrimmed);

    if (!tahunTrimmed) return alertError("Tahun tidak boleh kosong");
    if (!skorTrimmed || isNaN(skorNum) || skorNum < 0 || skorNum > 1)
      return alertError("Skor harus berupa angka antara 0 dan 1");

    const year = parseInt(tahunTrimmed);

    if (isAdding) {
      const exists = skorIDM.some((d) => d.tahun === tahunTrimmed);
      if (exists) return alertError(`Data tahun ${tahunTrimmed} sudah ada`);

      const response = await InfografisApi.createIdm({
        year,
        skor: skorNum * 100, // API minta skor dalam bentuk persen
      });
      const resBody = await response.json();

      if (!response.ok) {
        return alertError(resBody?.error ?? "Gagal menyimpan data");
      }

      const newData = resBody.idm; // karena API return-nya array

      setSkorIDM((prev) => [
        ...prev,
        {
          id: newData.id,
          tahun: newData.year.toString(),
          skor: newData.skor / 100,
        },
      ]);
      alertSuccess("Data berhasil ditambahkan.");
    } else {
      if (!(await alertConfirm("Yakin ingin mengubah data ini?"))) return;

      const response = await InfografisApi.updateIdm(editingIndex, {
        year,
        skor: skorNum * 100, // backend pakai persen
      });

      const resBody = await response.json();

      if (!response.ok) {
        return alertError(resBody?.error ?? "Gagal mengupdate data.");
      }

      const updated = skorIDM.map((item) =>
        item.id === editingIndex
          ? {
              ...item,
              tahun: resBody.idm.year.toString(),
              skor: resBody.idm.skor / 100,
            }
          : item
      );

      setSkorIDM(updated);
      alertSuccess("Data berhasil diubah.");
    }

    setShowForm(false);
  };
  useEffect(() => {
    loadAllIdmData();
  }, []);

  const loadAllIdmData = async () => {
    // --- Ambil skor IDM (chart + tabel) ---
    const responseIdm = await InfografisApi.getIdm();
    const resIdmBody = await responseIdm.json();

    if (responseIdm.ok && Array.isArray(resIdmBody.idm)) {
      const mapped = resIdmBody.idm.map((d) => ({
        id: d.id,
        tahun: d.year.toString(),
        skor: d.skor / 100,
      }));
      setSkorIDM(mapped);
    } else {
      alertError("Gagal mengambil data grafik IDM.");
    }

    // --- Ambil data Extra IDM (status + 3 dimensi) ---
    const responseExtra = await InfografisApi.getExtraIdm();
    const resExtraBody = await responseExtra.json();

    if (
      responseExtra.ok &&
      Array.isArray(resExtraBody.extraIdm) &&
      resExtraBody.extraIdm.length > 0
    ) {
      const data = resExtraBody.extraIdm[0];
      setExtraIdmId(data.id);
      setStatusDesa(data.status_desa);
      setDimensiSosial(data.sosial);
      setDimensiEkonomi(data.ekonomi);
      setDimensiLingkungan(data.lingkungan);

      // Sync ke temp juga
      setTempStatus(data.status_desa);
      setTempSosial(data.sosial);
      setTempEkonomi(data.ekonomi);
      setTempLingkungan(data.lingkungan);
    } else {
      alertError("Gagal mengambil data status desa & dimensi.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* - Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Skor IDM Desa Babakan Asem
          </h2>
          <p className="mt-2 text-gray-600">
            Perkembangan <strong>Indeks Desa Membangun (IDM)</strong> dari tahun
            ke tahun.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          + Tambah Data
        </button>
      </div>

      {/* - Kotak Statistik (edit & simpan) */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Status Desa</p>
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            className="mt-2 border rounded px-3 py-2 text-gray-800"
          >
            <option value="MAJU">Maju</option>
            <option value="BERKEMBANG">Berkembang</option>
            <option value="MANDIRI">Mandiri</option>
            <option value="TERINGGAL">Tertinggal</option>
            <option value="SANGAT_TERTINGGAL">Sangat Tertinggal</option>
          </select>
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Sosial</p>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={tempSosial}
            onChange={(e) => setTempSosial(parseFloat(e.target.value))}
            className="mt-2 border rounded px-3 py-2 w-20 text-center"
          />
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Ekonomi</p>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={tempEkonomi}
            onChange={(e) => setTempEkonomi(parseFloat(e.target.value))}
            className="mt-2 border rounded px-3 py-2 w-20 text-center"
          />
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Dimensi Lingkungan</p>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={tempLingkungan}
            onChange={(e) => setTempLingkungan(parseFloat(e.target.value))}
            className="mt-2 border rounded px-3 py-2 w-20 text-center"
          />
        </div>
      </div>

      {/* - Tombol Simpan Perubahan */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSaveStatistik}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          💾 Simpan Perubahan
        </button>
      </div>

      {/* - Tampilan nilai tersimpan */}
      <div className="mt-4 text-gray-700">
        <p>
          <strong>Status Desa:</strong> {statusDesa}
        </p>
        <p>
          <strong>Dimensi Sosial:</strong> {dimensiSosial}
        </p>
        <p>
          <strong>Dimensi Ekonomi:</strong> {dimensiEkonomi}
        </p>
        <p>
          <strong>Dimensi Lingkungan:</strong> {dimensiLingkungan}
        </p>
      </div>

      {/* - Tabel Data */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">
                Tahun
              </th>
              <th className="p-3 text-left font-semibold text-gray-700">
                Skor
              </th>
              <th className="p-3 text-left font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {skorIDM.map((data) => (
              <tr key={data.id} className="...">
                <td className="p-3">{data.tahun}</td>
                <td className="p-3">{data.skor}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => handleEdit(data.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(data.id)}
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

      {/* - Grafik Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Grafik Perkembangan Skor IDM
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skorIDM}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tahun" />
            <YAxis domain={[0.6, 1]} />
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

      {/* - Modal Form Tambah/Edit Skor IDM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Tambah Data IDM" : "Edit Data IDM"}
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
              placeholder="Contoh: 2025"
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
