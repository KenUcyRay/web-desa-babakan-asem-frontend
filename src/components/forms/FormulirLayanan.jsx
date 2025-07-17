import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormulirLayanan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    layanan: "",
    pesan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Formulir layanan berhasil dikirim!");
    navigate("/administrasi");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Formulir Layanan Desa
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Aktif
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contoh@email.com"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Jenis Layanan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Pilih Layanan
            </label>
            <select
              name="layanan"
              value={formData.layanan}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Pilih Layanan --</option>
              <option value="Pengaduan">Pengaduan</option>
              <option value="Permohonan">Permohonan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Pesan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Pesan / Permintaan
            </label>
            <textarea
              name="pesan"
              value={formData.pesan}
              onChange={handleChange}
              placeholder="Tuliskan permintaan layanan Anda..."
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
              Kirim Formulir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
