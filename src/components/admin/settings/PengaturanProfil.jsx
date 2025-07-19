import { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { FaUser, FaLock, FaSave, FaIdBadge, FaCopy } from "react-icons/fa";
import { alertSuccess } from "../../../libs/alert";

export default function PengaturanProfil() {
  // ✅ Dummy awal
  const [profile, setProfile] = useState({
    id: "ADM-20250719-XYZ",
    name: "Admin Desa",
    email: "admin@desa.id",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === "" && email === "" && password === "") {
      alert("⚠️ Isi minimal salah satu field!");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Password tidak cocok!");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
    }));

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    alertSuccess("✅ Dummy perubahan disimpan!");
  };

  const copyId = () => {
    navigator.clipboard.writeText(profile.id);
    alertSuccess("📋 ID berhasil disalin!");
  };

  useEffect(() => {
    // dummy fetch
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* ✅ Sidebar tetap */}
      <AdminSidebar />

      {/* ✅ Konten utama */}
      <div className="md:ml-64 flex-1 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Pengaturan Profil Admin
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-2xl mx-auto w-full"
        >
          {/* ✅ ID Admin (Read-only + copy) */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaIdBadge />
              ID Admin
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profile.id}
                readOnly
                className="border rounded w-full p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={copyId}
                className="px-3 py-2 bg-green-500 text-white rounded hover:opacity-80"
              >
                <FaCopy />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ID ini dibuat otomatis dan tidak bisa diubah.
            </p>
          </div>

          {/* ✅ Ganti Nama Admin */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaUser />
              Nama
            </label>
            <input
              type="text"
              placeholder={profile.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>

          {/* ✅ Ganti Email */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaUser />
              Email
            </label>
            <input
              type="email"
              placeholder={profile.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>

          {/* ✅ Ganti Password */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaLock /> Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="border rounded w-full p-2"
            />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaLock /> Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
              className="border rounded w-full p-2"
            />
          </div>

          {/* ✅ Tombol Simpan */}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-3 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FaSave /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
