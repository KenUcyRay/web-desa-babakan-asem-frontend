import { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { UserApi } from "../../../libs/api/UserApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function PengaturanProfil() {
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    const response = await UserApi.getUserProfile();
    if (!response.ok) {
      alertError("Gagal mengambil profil.");
      return;
    }
    const responseBody = await response.json();
    setProfile(responseBody.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      alertError(
        "Harap isi minimal salah satu field (Nama, Email, atau Password)."
      );
      return;
    }

    const confirm = await alertConfirm(
      "Apakah Anda yakin ingin menyimpan perubahan?"
    );
    if (!confirm) return;

    if (password.trim() !== "" && confirmPassword.trim() === "") {
      alertError("Harap isi konfirmasi password.");
      return;
    }

    if (password !== confirmPassword) {
      alertError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    const updatedName = name === "" ? undefined : name;
    const updatedEmail = email === "" ? undefined : email;
    const updatedPassword = password === "" ? undefined : password;
    const updatedConfirmPassword =
      confirmPassword === "" ? undefined : confirmPassword;

    const response = await UserApi.updateUser(
      updatedName,
      updatedEmail,
      updatedPassword,
      updatedConfirmPassword
    );
    const responseBody = await response.json();

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    if (!response.ok) {
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
      return;
    }
    setProfile(responseBody.user);
    alertSuccess("Perubahan berhasil disimpan!");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Profil Admin</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ ID Admin (tidak bisa diubah + tombol salin) */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <label className="font-semibold mb-2 flex items-center gap-2">
              <FaUser /> ID Admin
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profile.id || ""}
                readOnly
                className="border rounded w-full p-2 bg-gray-100 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(profile.id);
                  alertSuccess("ID berhasil disalin ke clipboard");
                }}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
              >
                Salin
              </button>
            </div>
          </div>

          {/* Ganti Nama Admin */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
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

          <div className="bg-white p-6 rounded-xl shadow mb-6">
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

          {/* Ganti Password */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
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

          <div className="bg-white p-6 rounded-xl shadow mb-6">
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

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaSave /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
