import { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { FaUser, FaLock, FaSave } from "react-icons/fa";

export default function PengaturanProfil() {
  const [namaAdmin, setNamaAdmin] = useState("Admin Desa");
  const [passwordBaru, setPasswordBaru] = useState("");

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Profil Admin</h1>

        {/* Ganti Nama Admin */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2 flex items-center gap-2"><FaUser /> Nama Admin</label>
          <input
            type="text"
            value={namaAdmin}
            onChange={(e) => setNamaAdmin(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Ganti Password */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <label className="block font-semibold mb-2 flex items-center gap-2"><FaLock /> Password Baru</label>
          <input
            type="password"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Tombol Simpan */}
        <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaSave /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}