import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { alertError, alertSuccess } from "../../libs/alert";

export default function SuratPengantar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    type: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await AdministrasiApi.createPengantar(formData);
    const responseBody = await response.json();
    if (!response.ok) {
      let errorMessage = "Gagal menyimpan perubahan.";
      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) =>
          err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
        );
        errorMessage = errorMessages.join(", ");
      } else if (typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    await alertSuccess("Pengajuan surat pengantar berhasil dikirim!");
    navigate("/administrasi");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Form Pengajuan Surat Pengantar
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nomor Induk Kependudukan (NIK)
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              required
              placeholder="Masukkan NIK"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Jenis Surat */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Jenis Surat
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Pilih Jenis Surat --</option>
              <option value="KTP">Surat Pengantar KTP</option>
              <option value="KK">Surat Pengantar KK</option>
              <option value="SKCK">Surat Pengantar SKCK</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Keterangan Tambahan
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Tuliskan keterangan tambahan..."
              rows="4"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>

          {/* Tombol */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
