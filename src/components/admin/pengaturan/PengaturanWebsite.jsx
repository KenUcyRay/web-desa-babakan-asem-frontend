import { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { FaSave, FaImage, FaPalette } from "react-icons/fa";

export default function PengaturanWebsite() {
  const [namaDesa, setNamaDesa] = useState("Desa Babakan Asem");
  const [logoPreview, setLogoPreview] = useState("https://via.placeholder.com/120x120");
  const [themeColor, setThemeColor] = useState("green");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Website</h1>

        {/* Ganti Nama Desa */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2">Nama Desa</label>
          <input
            type="text"
            value={namaDesa}
            onChange={(e) => setNamaDesa(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Upload Logo */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2 flex items-center gap-2"><FaImage /> Logo Desa</label>
          <img src={logoPreview} alt="Preview" className="w-32 mb-4" />
          <input type="file" onChange={handleLogoChange} />
        </div>

        {/* Pilih Tema Warna */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2 flex items-center gap-2"><FaPalette /> Tema Warna</label>
          <select
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="border rounded p-2"
          >
            <option value="green">Hijau</option>
            <option value="blue">Biru</option>
            <option value="purple">Ungu</option>
          </select>
        </div>

        {/* Tombol Simpan */}
        <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaSave /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}