import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InfografisApi } from "../../../libs/api/InfografisApi";
import { alertError, alertSuccess, alertConfirm } from "../../../libs/alert";
import { Helper } from "../../../utils/Helper";

export default function ManageBansos() {
  const { i18n } = useTranslation();
  const [bansos, setBansos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    penerima: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBansos = async () => {
    const response = await InfografisApi.getBansos(i18n.language);
    const result = await response.json();

    if (!response.ok) {
      return;
    }

    setBansos(result.bansos);

    const latest = result.bansos.reduce((a, b) => {
      return new Date(a.updated_at || 0) > new Date(b.updated_at || 0) ? a : b;
    }, {});
    if (latest.updated_at) {
      setLastUpdated(latest.updated_at);
    }
  };

  const handleAdd = () => {
    setFormData({ id: null, nama: "", penerima: "" });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nama: item.name,
      penerima: item.amount.toString(),
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    const confirm = await alertConfirm(`Yakin ingin menghapus ${name}`);
    if (!confirm) return;

    const res = await InfografisApi.deleteBansos(id, i18n.language);
    if (!res.ok) {
      await Helper.errorResponseHandler(await res.json());
      return;
    }
    await fetchBansos();
    await alertSuccess("Data berhasil dihapus");
  };

  const handleSave = async () => {
    const { nama, penerima, id } = formData;

    const payload = { name: nama.trim(), amount: parseInt(penerima) };

    if (isEditing) {
      const res = await InfografisApi.updateBansos(id, payload, i18n.language);
      if (!res.ok) {
        await Helper.errorResponseHandler(await res.json());
        return;
      }

      const updated = [...bansos].map((item) =>
        item.id === id
          ? { ...item, name: nama.trim(), amount: parseInt(penerima) }
          : item
      );
      setBansos(updated);
      alertSuccess("Data berhasil diperbarui!");
      setShowForm(false);
    } else {
      const res = await InfografisApi.createBansos(payload, i18n.language);
      const json = await res.json();
      if (!res.ok) {
        await Helper.errorResponseHandler(json);
        return;
      }
      const newItem = {
        id: json.bansos.id,
        name: json.bansos.name,
        amount: json.bansos.amount,
        created_at: json.bansos.created_at,
      };
      setBansos((prev) => [newItem, ...prev]);
      alertSuccess("Data berhasil ditambahkan!");
      setShowForm(false);
    }
  };

  useEffect(() => {
    fetchBansos();
  }, [i18n.language]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Kelola Bantuan Sosial
          </h2>
          <p className="mt-2 text-gray-600">
            Manajemen data bantuan sosial di desa.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Terakhir diperbarui: {Helper.formatTanggal(lastUpdated)}
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
        >
          + Tambah
        </button>
      </div>

      {/* List Card */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bansos.length > 0 ? (
          bansos.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow relative hover:shadow-lg hover:scale-[1.02] transition"
            >
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">Jumlah penerima</p>
              <p className="mt-2 text-2xl font-bold text-[#B6F500]">
                {item.amount}
              </p>
              {item.updated_at && (
                <p className="text-xs text-gray-400 mt-2">
                  Diperbarui: {Helper.formatTanggal(item.updated_at)}
                </p>
              )}
              <div className="absolute top-3 right-3 flex gap-3 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            Tidak ada data bantuan sosial saat ini.
          </p>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Bantuan Sosial" : " Tambah Bantuan Sosial"}
            </h3>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nama Bantuan
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nama: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Contoh: BLT Dana Desa"
            />

            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Jumlah Penerima
            </label>
            <input
              type="number"
              min="0"
              value={formData.penerima}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, penerima: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Contoh: 100"
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
